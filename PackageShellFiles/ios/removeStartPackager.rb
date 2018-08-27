def clear_react_startPackage_script
  require 'xcodeproj'
  project_path = "../node_modules/react-native/React/React.xcodeproj"
  findTargetName = "React"
  findTargetShellScriptBuildPhaseName = "Start Packager"
  project = Xcodeproj::Project.open(project_path)
  project.targets.each do |target|
    next if target.name != findTargetName
    target.build_phases.each do |build_phase|
      if build_phase.class == Xcodeproj::Project::Object::PBXShellScriptBuildPhase && build_phase.name == findTargetShellScriptBuildPhaseName
        build_phase.shell_script = ""
        project.save
        puts "Success clear React/Start Packager/shell_script!"
        break
      end
    end
    break
  end
end

clear_react_startPackage_script