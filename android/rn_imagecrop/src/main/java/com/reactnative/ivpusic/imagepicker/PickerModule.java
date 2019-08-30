package com.reactnative.ivpusic.imagepicker;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.ClipData;
import android.content.ContentResolver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.media.MediaMetadataRetriever;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.provider.Settings;
import android.text.TextUtils;
import android.util.Base64;
import android.webkit.MimeTypeMap;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;
import androidx.core.content.FileProvider;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.PromiseImpl;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.PermissionAwareActivity;
import com.facebook.react.modules.core.PermissionListener;
import com.reactnative.ivpusic.imagepicker.picture.lib.PictureSelector;
import com.reactnative.ivpusic.imagepicker.picture.lib.config.PictureConfig;
import com.reactnative.ivpusic.imagepicker.picture.lib.config.PictureMimeType;
import com.reactnative.ivpusic.imagepicker.picture.lib.entity.LocalMedia;
import com.reactnative.ivpusic.imagepicker.picture.lib.imaging.IMGEditActivity;
import com.reactnative.ivpusic.imagepicker.picture.lib.tools.Md5Utils;
import com.yalantis.ucrop.UCrop;
import com.yalantis.ucrop.UCropActivity;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.Callable;

import static com.reactnative.ivpusic.imagepicker.CameraActivity.REQ_CAMERA;
import static com.reactnative.ivpusic.imagepicker.CameraActivity.RES_CAMERA_ERR;
import static com.reactnative.ivpusic.imagepicker.CameraActivity.RES_CAMERA_PICTURE;
import static com.reactnative.ivpusic.imagepicker.CameraActivity.RES_CAMERA_VIDEO;
import static com.reactnative.ivpusic.imagepicker.picture.lib.PicturePreviewActivity.REQ_IMAGE_EDIT;
import static com.reactnative.ivpusic.imagepicker.picture.lib.imaging.IMGEditActivity.EXTRA_IMAGE_SAVE_PATH;

class PickerModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private static final int IMAGE_PICKER_REQUEST = 61110;
    private static final int CAMERA_PICKER_REQUEST = 61111;
    private static final int MULTIPLE_IMAGE_PICKER_REQUEST = 61112;
    private static final String E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST";

    private static final String E_PICKER_CANCELLED_KEY = "E_PICKER_CANCELLED";
    private static final String E_PICKER_CANCELLED_MSG = "User cancelled image selection";

    private static final String E_CALLBACK_ERROR = "E_CALLBACK_ERROR";
    private static final String E_FAILED_TO_SHOW_PICKER = "E_FAILED_TO_SHOW_PICKER";
    private static final String E_FAILED_TO_OPEN_CAMERA = "E_FAILED_TO_OPEN_CAMERA";
    private static final String E_NO_IMAGE_DATA_FOUND = "E_NO_IMAGE_DATA_FOUND";
    private static final String E_CAMERA_IS_NOT_AVAILABLE = "E_CAMERA_IS_NOT_AVAILABLE";
    private static final String E_CANNOT_LAUNCH_CAMERA = "E_CANNOT_LAUNCH_CAMERA";
    private static final String E_PERMISSIONS_MISSING = "E_PERMISSION_MISSING";
    private static final String E_ERROR_WHILE_CLEANING_FILES = "E_ERROR_WHILE_CLEANING_FILES";

    private String mediaType = "any";
    private boolean multiple = false;
    private int allCount = 9;
    private boolean includeBase64 = false;
    private boolean includeExif = false;
    private boolean cropping = false;
    private boolean edit = false;
    private boolean cropperCircleOverlay = false;
    private boolean freeStyleCropEnabled = false;
    private boolean showCropGuidelines = true;
    private boolean hideBottomControls = false;
    private boolean enableRotationGesture = false;
    private boolean disableCropperColorSetters = false;
    private boolean useFrontCamera = false;
    public static boolean canVideo = false;
    private ReadableMap options;

    //Grey 800
    private final String DEFAULT_TINT = "#424242";
    private String cropperActiveWidgetColor = DEFAULT_TINT;
    private String cropperStatusBarColor = DEFAULT_TINT;
    private String cropperToolbarColor = DEFAULT_TINT;
    private String cropperToolbarTitle = null;

    //Light Blue 500
    private final String DEFAULT_WIDGET_COLOR = "#03A9F4";
    private int width = 0;
    private int height = 0;

    private Uri mCameraCaptureURI;
    private String mCurrentPhotoPath;
    private ResultCollector resultCollector = new ResultCollector();
    private Compression compression = new Compression();
    private ReactApplicationContext reactContext;

    PickerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(this);
        this.reactContext = reactContext;
    }

    private String getTmpDir(Activity activity) {
        String tmpDir = activity.getCacheDir() + "/react-native-image-crop-picker";
        new File(tmpDir).mkdir();

        return tmpDir;
    }

    @Override
    public String getName() {
        return "ImageCropPicker";
    }

    private void setConfiguration(final ReadableMap options) {
        mediaType = options.hasKey("mediaType") ? options.getString("mediaType") : "any";
        multiple = options.hasKey("multiple") ? options.getBoolean("multiple") : false;
        allCount = options.hasKey("maxFiles") ? options.getInt("maxFiles") : 9;
        includeBase64 = options.hasKey("includeBase64") ? options.getBoolean("includeBase64") : false;
        includeExif = options.hasKey("includeExif") ? options.getBoolean("includeExif") : false;
        width = options.hasKey("width") ? options.getInt("width") : 200;
        height = options.hasKey("height") ? options.getInt("height") : 200;
        cropping = options.hasKey("cropping") ? options.getBoolean("cropping") : false;
        edit = options.hasKey("edit") ? options.getBoolean("edit") : false;
        cropperActiveWidgetColor = options.hasKey("cropperActiveWidgetColor") ? options.getString("cropperActiveWidgetColor") : DEFAULT_TINT;
        cropperStatusBarColor = options.hasKey("cropperStatusBarColor") ? options.getString("cropperStatusBarColor") : DEFAULT_TINT;
        cropperToolbarColor = options.hasKey("cropperToolbarColor") ? options.getString("cropperToolbarColor") : DEFAULT_TINT;
        cropperToolbarTitle = options.hasKey("cropperToolbarTitle") ? options.getString("cropperToolbarTitle") : null;
        cropperCircleOverlay = options.hasKey("cropperCircleOverlay") ? options.getBoolean("cropperCircleOverlay") : false;
        freeStyleCropEnabled = options.hasKey("freeStyleCropEnabled") ? options.getBoolean("freeStyleCropEnabled") : false;
        showCropGuidelines = options.hasKey("showCropGuidelines") ? options.getBoolean("showCropGuidelines") : true;
        hideBottomControls = options.hasKey("hideBottomControls") ? options.getBoolean("hideBottomControls") : false;
        enableRotationGesture = options.hasKey("enableRotationGesture") ? options.getBoolean("enableRotationGesture") : false;
        disableCropperColorSetters = options.hasKey("disableCropperColorSetters") ? options.getBoolean("disableCropperColorSetters") : false;
        useFrontCamera = options.hasKey("useFrontCamera") ? options.getBoolean("useFrontCamera") : false;
        canVideo = options.hasKey("canVideo") ? options.getBoolean("canVideo") : false;
        this.options = options;
    }

    private void deleteRecursive(File fileOrDirectory) {
        if (fileOrDirectory.isDirectory()) {
            for (File child : fileOrDirectory.listFiles()) {
                deleteRecursive(child);
            }
        }

        fileOrDirectory.delete();
    }

    @ReactMethod
    public void clean(final Promise promise) {

        final Activity activity = getCurrentActivity();
        final PickerModule module = this;

        if (activity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
            return;
        }

        permissionsCheck(activity, promise, Collections.singletonList(Manifest.permission.WRITE_EXTERNAL_STORAGE), new Callable<Void>() {
            @Override
            public Void call() {
                try {
                    File file = new File(module.getTmpDir(activity));
                    if (!file.exists()) throw new Exception("File does not exist");

                    module.deleteRecursive(file);
                    promise.resolve(null);
                } catch (Exception ex) {
                    ex.printStackTrace();
                    promise.reject(E_ERROR_WHILE_CLEANING_FILES, ex.getMessage());
                }

                return null;
            }
        });
    }

    @ReactMethod
    public void cleanSingle(final String pathToDelete, final Promise promise) {
        if (pathToDelete == null) {
            promise.reject(E_ERROR_WHILE_CLEANING_FILES, "Cannot cleanup empty path");
            return;
        }

        final Activity activity = getCurrentActivity();
        final PickerModule module = this;

        if (activity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
            return;
        }

        permissionsCheck(activity, promise, Collections.singletonList(Manifest.permission.WRITE_EXTERNAL_STORAGE), new Callable<Void>() {
            @Override
            public Void call() throws Exception {
                try {
                    String path = pathToDelete;
                    final String filePrefix = "file://";
                    if (path.startsWith(filePrefix)) {
                        path = path.substring(filePrefix.length());
                    }

                    File file = new File(path);
                    if (!file.exists()) throw new Exception("File does not exist. Path: " + path);

                    module.deleteRecursive(file);
                    promise.resolve(null);
                } catch (Exception ex) {
                    ex.printStackTrace();
                    promise.reject(E_ERROR_WHILE_CLEANING_FILES, ex.getMessage());
                }

                return null;
            }
        });
    }

    private void permissionsCheck(final Activity activity, final Promise promise, final List<String> requiredPermissions, final Callable<Void> callback) {

        List<String> missingPermissions = new ArrayList<>();

        for (String permission : requiredPermissions) {
            int status = ActivityCompat.checkSelfPermission(activity, permission);
            if (status != PackageManager.PERMISSION_GRANTED) {
                missingPermissions.add(permission);
            }
        }

        if (!missingPermissions.isEmpty()) {

            ((PermissionAwareActivity) activity).requestPermissions(missingPermissions.toArray(new String[missingPermissions.size()]), 1, new PermissionListener() {

                @Override
                public boolean onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
                    if (requestCode == 1) {

                        for (int grantResult : grantResults) {
                            if (grantResult == PackageManager.PERMISSION_DENIED) {
                                goSettingView(permissions, promise);
                                return true;
                            }
                        }

                        try {
                            callback.call();
                        } catch (Exception e) {
                            promise.reject(E_CALLBACK_ERROR, "Unknown error", e);
                        }
                    }

                    return true;
                }
            });

            return;
        }

        // all permissions granted
        try {
            callback.call();
        } catch (Exception e) {
            promise.reject(E_CALLBACK_ERROR, "Unknown error", e);
        }
    }

    @ReactMethod
    public void openCamera(final ReadableMap options, final Promise promise) {
        final Activity activity = getCurrentActivity();

        if (activity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
            return;
        }

        if (!isCameraAvailable(activity)) {
            promise.reject(E_CAMERA_IS_NOT_AVAILABLE, "Camera not available");
            return;
        }

        setConfiguration(options);
        resultCollector.setup(promise, multiple);

        permissionsCheck(activity, promise, Arrays.asList(Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE), new Callable<Void>() {
            @Override
            public Void call() {
                initiateCamera(activity);
                return null;
            }
        });
    }

    @ReactMethod
    public void openCameraAndRecord(final ReadableMap options, final Promise promise) {
        final Activity activity = getCurrentActivity();

        if (activity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
            return;
        }

        if (!isCameraAvailable(activity)) {
            promise.reject(E_CAMERA_IS_NOT_AVAILABLE, "Camera not available");
            return;
        }

        setConfiguration(options);
        resultCollector.setup(promise, multiple);

        permissionsCheck(activity, promise, Arrays.asList(Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.RECORD_AUDIO), new Callable<Void>() {
            @Override
            public Void call() {
                openCameraView(activity);
                return null;
            }
        });
    }

    private void openCameraView(Activity activity) {
        activity.startActivityForResult(new Intent(activity, CameraActivity.class), REQ_CAMERA);
    }

    private void goSettingView(String[] type, final Promise promise) {
        final AlertDialog.Builder normalDialog = new AlertDialog.Builder(getCurrentActivity());
        normalDialog.setTitle("提示");
        normalDialog.setMessage(Permission.getPermissionContent(Arrays.asList(type)));
        normalDialog.setCancelable(false);
        normalDialog.setPositiveButton("去设置", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                //...To-do
                Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                Uri uri = Uri.fromParts("package", getCurrentActivity().getPackageName(), null);
                intent.setData(uri);
                getCurrentActivity().startActivity(intent);//设置了requestcode 需要在OnActivityResult 中再次判断是否勾选了所需权限
            }
        });
        normalDialog.setNegativeButton("取消", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                promise.reject(E_PERMISSIONS_MISSING, "Required permission missing");
            }
        });

        normalDialog.show();

    }

    private void initiateCamera(Activity activity) {

        try {
            Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            File imageFile = createImageFile();

            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
                mCameraCaptureURI = Uri.fromFile(imageFile);
            } else {
                mCameraCaptureURI = FileProvider.getUriForFile(activity, activity.getApplicationContext().getPackageName() + ".fileProvider", imageFile);
            }

            cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, mCameraCaptureURI);

            if (this.useFrontCamera) {
                cameraIntent.putExtra("android.intent.extras.CAMERA_FACING", 1);
                cameraIntent.putExtra("android.intent.extras.LENS_FACING_FRONT", 1);
                cameraIntent.putExtra("android.intent.extra.USE_FRONT_CAMERA", true);
            }

            if (cameraIntent.resolveActivity(activity.getPackageManager()) == null) {
                resultCollector.notifyProblem(E_CANNOT_LAUNCH_CAMERA, "Cannot launch camera");
                return;
            }

            activity.startActivityForResult(cameraIntent, CAMERA_PICKER_REQUEST);
        } catch (Exception e) {
            resultCollector.notifyProblem(E_FAILED_TO_OPEN_CAMERA, e);
        }

    }

    private void initiatePicker(final Activity activity) {
        try {
            final Intent galleryIntent = new Intent(Intent.ACTION_GET_CONTENT);

            if (cropping || mediaType.equals("photo")) {
                galleryIntent.setType("image/*");
            } else if (mediaType.equals("video")) {
                galleryIntent.setType("video/*");
            } else {
                galleryIntent.setType("*/*");
                String[] mimetypes = {"image/*", "video/*"};
                galleryIntent.putExtra(Intent.EXTRA_MIME_TYPES, mimetypes);
            }

            galleryIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            galleryIntent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, multiple);
            galleryIntent.addCategory(Intent.CATEGORY_OPENABLE);


            if (multiple) {
                if (edit) {
                    PictureSelector.create(getCurrentActivity()).openGallery(canVideo ? PictureMimeType.ofAll() : PictureMimeType.ofImage())//全部.PictureMimeType.ofAll()、图片.ofImage()、视频.ofVideo()、音频.ofAudio()
                            .theme(R.style.picture_default_style)//主题样式(不设置为默认样式) 也可参考demo values/styles下 例如：R.style.picture.white.style
                            .maxSelectNum(allCount)// 最大图片选择数量 int
                            //.minSelectNum()// 最小选择数量 int
                            .imageSpanCount(4)// 每行显示个数 int
                            .selectionMode(PictureConfig.MULTIPLE)// 多选 or 单选 PictureConfig.MULTIPLE or PictureConfig.SINGLE
                            .previewImage(true)// 是否可预览图片 true or false
                            .previewVideo(true)// 是否可预览视频 true or false
                            .enablePreviewAudio(true) // 是否可播放音频 true or false
                            .isCamera(true)// 是否显示拍照按钮 true or false
                            .imageFormat(PictureMimeType.PNG)// 拍照保存图片格式后缀,默认jpeg
                            .isZoomAnim(true)// 图片列表点击 缩放效果 默认true
                            .sizeMultiplier(0.5f)// glide 加载图片大小 0~1之间 如设置 .glideOverride()无效
                            // .setOutputCameraPath("/CustomPath")// 自定义拍照保存路径,可不填
                            .enableCrop(true)// 是否裁剪 true or false
                            .compress(true)// 是否压缩 true or false
                            .glideOverride(160, 160)// int glide 加载宽高，越小图片列表越流畅，但会影响列表图片浏览的清晰度
                            .withAspectRatio(1, 1)// int 裁剪比例 如16:9 3:2 3:4 1:1 可自定义
                            .hideBottomControls(true)// 是否显示uCrop工具栏，默认不显示 true or false
                            .isGif(false)// 是否显示gif图片 true or false
                            //.compressSavePath(getPath())//压缩图片保存地址
                            .freeStyleCropEnabled(true)// 裁剪框是否可拖拽 true or false
                            .circleDimmedLayer(false)// 是否圆形裁剪 true or false
                            .showCropFrame(true)// 是否显示裁剪矩形边框 圆形裁剪时建议设为false   true or false
                            .showCropGrid(true)// 是否显示裁剪矩形网格 圆形裁剪时建议设为false    true or false
                            .openClickSound(false)// 是否开启点击声音 true or false
                            // .selectionMedia()// 是否传入已选图片 List<LocalMedia> list
                            .previewEggs(true)// 预览图片时 是否增强左右滑动图片体验(图片滑动一半即可看到上一张是否选中) true or false
                            // .cropCompressQuality()// 裁剪压缩质量 默认90 int
                            .minimumCompressSize(100)// 小于100kb的图片不压缩
                            .synOrAsy(true)//同步true或异步false 压缩 默认同步
                            //.cropWH()// 裁剪宽高比，设置如果大于图片本身宽高则无效 int
                            // .rotateEnabled() // 裁剪是否可旋转图片 true or false
                            .scaleEnabled(true)// 裁剪是否可放大缩小图片 true or false
                            // .videoQuality()// 视频录制质量 0 or 1 int
                            .videoMaxSecond(30)// 显示多少秒以内的视频or音频也可适用 int
                            .videoMinSecond(1)// 显示多少秒以内的视频or音频也可适用 int
                            //.recordVideoSecond()//视频秒数录制 默认60s int
                            .isDragFrame(false)// 是否可拖动裁剪框(固定)
                            .forResult(PictureConfig.CHOOSE_REQUEST);//结果回调onActivityResult code
                } else {
                    Intent intentCustomerAlbum = new Intent(getCurrentActivity(), CustomerGalleryActivity.class);
                    intentCustomerAlbum.putExtra("allCount", allCount);
                    getCurrentActivity().startActivityForResult(intentCustomerAlbum, MULTIPLE_IMAGE_PICKER_REQUEST);
                }


            } else {
                final Intent chooserIntent = Intent.createChooser(galleryIntent, "Pick an image");
                activity.startActivityForResult(chooserIntent, IMAGE_PICKER_REQUEST);
            }


        } catch (Exception e) {
            resultCollector.notifyProblem(E_FAILED_TO_SHOW_PICKER, e);
        }
    }

    @ReactMethod
    public void openPicker(final ReadableMap options, final Promise promise) {
        final Activity activity = getCurrentActivity();

        if (activity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
            return;
        }

        setConfiguration(options);
        resultCollector.setup(promise, multiple);

        permissionsCheck(activity, promise, Collections.singletonList(Manifest.permission.WRITE_EXTERNAL_STORAGE), new Callable<Void>() {
            @Override
            public Void call() {
                initiatePicker(activity);
                return null;
            }
        });
    }

    @ReactMethod
    public void openCropper(final ReadableMap options, final Promise promise) {
        final Activity activity = getCurrentActivity();

        if (activity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
            return;
        }

        setConfiguration(options);
        resultCollector.setup(promise, false);

        Uri uri = Uri.parse(options.getString("path"));
        startCropping(activity, uri);
    }

    private String getBase64StringFromFile(String absoluteFilePath) {
        InputStream inputStream;

        try {
            inputStream = new FileInputStream(new File(absoluteFilePath));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            return null;
        }

        byte[] bytes;
        byte[] buffer = new byte[8192];
        int bytesRead;
        ByteArrayOutputStream output = new ByteArrayOutputStream();

        try {
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                output.write(buffer, 0, bytesRead);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        bytes = output.toByteArray();
        return Base64.encodeToString(bytes, Base64.NO_WRAP);
    }

    private String getMimeType(String url) {
        String mimeType = null;
        Uri uri = Uri.fromFile(new File(url));
        if (uri.getScheme().equals(ContentResolver.SCHEME_CONTENT)) {
            ContentResolver cr = this.reactContext.getContentResolver();
            mimeType = cr.getType(uri);
        } else {
            String fileExtension = MimeTypeMap.getFileExtensionFromUrl(uri.toString());
            if (fileExtension != null) {
                mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(fileExtension.toLowerCase());
            }
        }
        return mimeType;
    }

    private WritableMap getSelection(Activity activity, Uri uri, boolean isCamera) throws Exception {
        String path = resolveRealPath(activity, uri, isCamera);
        if (path == null || path.isEmpty()) {
            throw new Exception("Cannot resolve asset path.");
        }

        return getImage(activity, path);
    }

    private void getAsyncSelection(final Activity activity, Uri uri, boolean isCamera) throws Exception {
        String path = resolveRealPath(activity, uri, isCamera);
        if (path == null || path.isEmpty()) {
            resultCollector.notifyProblem(E_NO_IMAGE_DATA_FOUND, "Cannot resolve asset path.");
            return;
        }

        String mime = getMimeType(path);
        if (mime != null && mime.startsWith("video/")) {
            getVideo(activity, path, mime);
            return;
        }

        resultCollector.notifySuccess(getImage(activity, path));
    }

    private Bitmap validateVideo(String path) throws Exception {
        MediaMetadataRetriever retriever = new MediaMetadataRetriever();
        retriever.setDataSource(path);
        Bitmap bmp = retriever.getFrameAtTime();

        if (bmp == null) {
            throw new Exception("Cannot retrieve video data");
        }

        return bmp;
    }

    private void getVideo(final Activity activity, final String path, final String mime) throws Exception {
        validateVideo(path);
        final String compressedVideoPath = getTmpDir(activity) + "/" + UUID.randomUUID().toString() + ".mp4";

        new Thread(new Runnable() {
            @Override
            public void run() {
                compression.compressVideo(activity, options, path, compressedVideoPath, new PromiseImpl(new Callback() {
                    @Override
                    public void invoke(Object... args) {
                        String videoPath = (String) args[0];

                        try {
                            Bitmap bmp = validateVideo(videoPath);
                            long modificationDate = new File(videoPath).lastModified();

                            WritableMap video = new WritableNativeMap();
                            video.putInt("width", bmp.getWidth());
                            video.putInt("height", bmp.getHeight());
                            video.putString("mime", mime);
                            video.putInt("size", (int) new File(videoPath).length());
                            video.putString("path", "file://" + videoPath);
                            video.putString("modificationDate", String.valueOf(modificationDate));

                            resultCollector.notifySuccess(video);
                        } catch (Exception e) {
                            resultCollector.notifyProblem(E_NO_IMAGE_DATA_FOUND, e);
                        }
                    }
                }, new Callback() {
                    @Override
                    public void invoke(Object... args) {
                        WritableNativeMap ex = (WritableNativeMap) args[0];
                        resultCollector.notifyProblem(ex.getString("code"), ex.getString("message"));
                    }
                }));
            }
        }).run();
    }

    private String resolveRealPath(Activity activity, Uri uri, boolean isCamera) throws IOException {
        String path;

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
            path = RealPathUtil.getRealPathFromURI(activity, uri);
        } else {
            if (isCamera) {
                Uri imageUri = Uri.parse(mCurrentPhotoPath);
                path = imageUri.getPath();
            } else {
                path = RealPathUtil.getRealPathFromURI(activity, uri);
            }
        }

        return path;
    }

    private BitmapFactory.Options validateImage(String path) throws Exception {
        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        options.inPreferredConfig = Bitmap.Config.RGB_565;
        options.inDither = true;

        BitmapFactory.decodeFile(path, options);

        if (options.outMimeType == null || options.outWidth == 0 || options.outHeight == 0) {
            throw new Exception("Invalid image selected");
        }

        return options;
    }

    private WritableMap getImage(final Activity activity, String path) throws Exception {
        WritableMap image = new WritableNativeMap();

        if (path.startsWith("http://") || path.startsWith("https://")) {
            throw new Exception("Cannot select remote files");
        }
        BitmapFactory.Options original = validateImage(path);

        // if compression options are provided image will be compressed. If none options is provided,
        // then original image will be returned
        File compressedImage = compression.compressImage(activity, options, path, original);
        String compressedImagePath = compressedImage.getPath();
        BitmapFactory.Options options = validateImage(compressedImagePath);
        long modificationDate = new File(path).lastModified();

        image.putString("path", "file://" + compressedImagePath);
        image.putInt("width", options.outWidth);
        image.putInt("height", options.outHeight);
        image.putString("mime", options.outMimeType);
        image.putInt("size", (int) new File(compressedImagePath).length());
        image.putString("modificationDate", String.valueOf(modificationDate));

        if (includeBase64) {
            image.putString("data", getBase64StringFromFile(compressedImagePath));
        }

        if (includeExif) {
            try {
                WritableMap exif = ExifExtractor.extract(path);
                image.putMap("exif", exif);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }

        return image;
    }

    private void configureCropperColors(UCrop.Options options) {
        int activeWidgetColor = Color.parseColor(cropperActiveWidgetColor);
        int toolbarColor = Color.parseColor(cropperToolbarColor);
        int statusBarColor = Color.parseColor(cropperStatusBarColor);
        options.setToolbarColor(toolbarColor);
        options.setStatusBarColor(statusBarColor);
        if (activeWidgetColor == Color.parseColor(DEFAULT_TINT)) {
            /*
            Default tint is grey => use a more flashy color that stands out more as the call to action
            Here we use 'Light Blue 500' from https://material.google.com/style/color.html#color-color-palette
            */
            options.setActiveWidgetColor(Color.parseColor(DEFAULT_WIDGET_COLOR));
        } else {
            //If they pass a custom tint color in, we use this for everything
            options.setActiveWidgetColor(activeWidgetColor);
        }
    }

    private void startCropping(Activity activity, Uri uri) {
        UCrop.Options options = new UCrop.Options();
        options.setCompressionFormat(Bitmap.CompressFormat.JPEG);
        options.setCompressionQuality(100);
        options.setCircleDimmedLayer(cropperCircleOverlay);
        options.setFreeStyleCropEnabled(freeStyleCropEnabled);
        options.setShowCropGrid(showCropGuidelines);
        options.setHideBottomControls(hideBottomControls);
        if (cropperToolbarTitle != null) {
            options.setToolbarTitle(cropperToolbarTitle);
        }
        if (enableRotationGesture) {
            // UCropActivity.ALL = enable both rotation & scaling
            options.setAllowedGestures(UCropActivity.ALL, // When 'scale'-tab active
                    UCropActivity.ALL, // When 'rotate'-tab active
                    UCropActivity.ALL  // When 'aspect ratio'-tab active
            );
        }
        if (!disableCropperColorSetters) {
            configureCropperColors(options);
        }

        UCrop uCrop = UCrop.of(uri, Uri.fromFile(new File(this.getTmpDir(activity), UUID.randomUUID().toString() + ".jpg"))).withOptions(options);

        if (width > 0 && height > 0) {
            uCrop.withMaxResultSize(width, height).withAspectRatio(width, height);
        }

        uCrop.start(activity);
    }

    private void imagePickerResult(Activity activity, final int requestCode, final int resultCode, final Intent data) {
        if (resultCode == Activity.RESULT_CANCELED) {
            resultCollector.notifyProblem(E_PICKER_CANCELLED_KEY, E_PICKER_CANCELLED_MSG);
        } else if (resultCode == Activity.RESULT_OK) {
            if (multiple) {
                ClipData clipData = data.getClipData();

                try {
                    // only one image selected
                    if (clipData == null) {
                        resultCollector.setWaitCount(1);
                        getAsyncSelection(activity, data.getData(), false);
                    } else {
                        resultCollector.setWaitCount(clipData.getItemCount());
                        for (int i = 0; i < clipData.getItemCount(); i++) {
                            getAsyncSelection(activity, clipData.getItemAt(i).getUri(), false);
                        }
                    }
                } catch (Exception ex) {
                    resultCollector.notifyProblem(E_NO_IMAGE_DATA_FOUND, ex.getMessage());
                }

            } else {
                Uri uri = data.getData();

                if (uri == null) {
                    resultCollector.notifyProblem(E_NO_IMAGE_DATA_FOUND, "Cannot resolve image url");
                    return;
                }

                if (cropping) {
                    startCropping(activity, uri);
                } else {
                    try {
                        getAsyncSelection(activity, uri, false);
                    } catch (Exception ex) {
                        resultCollector.notifyProblem(E_NO_IMAGE_DATA_FOUND, ex.getMessage());
                    }
                }
            }
        }
    }

    private void cameraPickerResult(Activity activity, final int requestCode, final int resultCode, final Intent data) {
        if (resultCode == Activity.RESULT_CANCELED) {
            resultCollector.notifyProblem(E_PICKER_CANCELLED_KEY, E_PICKER_CANCELLED_MSG);
        } else if (resultCode == Activity.RESULT_OK) {
            Uri uri = mCameraCaptureURI;

            if (uri == null) {
                resultCollector.notifyProblem(E_NO_IMAGE_DATA_FOUND, "Cannot resolve image url");
                return;
            }
            if (edit) {
                String path = uri.getPath();
                File file = new File(activity.getCacheDir(), Md5Utils.md5(path) + String.valueOf(System.currentTimeMillis()) + ".jpg");
                Intent intent = new Intent(activity, IMGEditActivity.class);
                intent.putExtra(IMGEditActivity.EXTRA_IMAGE_URI, uri);
                intent.putExtra(EXTRA_IMAGE_SAVE_PATH, file.getAbsolutePath());
                activity.startActivityForResult(intent, REQ_IMAGE_EDIT);
            } else if (cropping) {
                UCrop.Options options = new UCrop.Options();
                options.setCompressionFormat(Bitmap.CompressFormat.JPEG);
                startCropping(activity, uri);
            } else {
                try {
                    resultCollector.setWaitCount(1);
                    resultCollector.notifySuccess(getSelection(activity, uri, true));
                } catch (Exception ex) {
                    resultCollector.notifyProblem(E_NO_IMAGE_DATA_FOUND, ex.getMessage());
                }
            }
        }
    }


    //简易处理板  （实际本没有发现什么问题，可以直接使用）
    public static String getRealPathFromURI(Context context, Uri uri) {
        if (null == uri) return null;

        final String scheme = uri.getScheme();
        String data = null;

        if (scheme == null) data = uri.getPath();
        else if (ContentResolver.SCHEME_FILE.equals(scheme)) {
            data = uri.getPath();
        } else if (ContentResolver.SCHEME_CONTENT.equals(scheme)) {
            Cursor cursor = context.getContentResolver().query(uri, new String[]{MediaStore.Images.ImageColumns.DATA}, null, null, null);
            if (null != cursor) {
                if (cursor.moveToFirst()) {
                    int index = cursor.getColumnIndex(MediaStore.Images.ImageColumns.DATA);
                    if (index > -1) {
                        data = cursor.getString(index);
                    }
                }
                cursor.close();
            }
        }
        return data;

    }


    private void croppingResult(Activity activity, final int requestCode, final int resultCode, final Intent data) {
        if (data != null) {
            final Uri resultUri = UCrop.getOutput(data);
            if (resultUri != null) {
                try {
                    WritableMap result = getSelection(activity, resultUri, false);
                    result.putMap("cropRect", PickerModule.getCroppedRectMap(data));

                    resultCollector.setWaitCount(1);
                    resultCollector.notifySuccess(result);
                } catch (Exception ex) {
                    resultCollector.notifyProblem(E_NO_IMAGE_DATA_FOUND, ex.getMessage());
                }
            } else {
                resultCollector.notifyProblem(E_NO_IMAGE_DATA_FOUND, "Cannot find image data");
            }
        } else {
            resultCollector.notifyProblem(E_PICKER_CANCELLED_KEY, E_PICKER_CANCELLED_MSG);
        }
    }

    private void multPickerResult(boolean isCancel, final Intent data) {
        if (isCancel) {
            resultCollector.notifyProblem(E_PICKER_CANCELLED_KEY, E_PICKER_CANCELLED_MSG);
        } else {
            ArrayList<String> images = data.getStringArrayListExtra("urls");
            resultCollector.setWaitCount(images.size());
            for (int i = 0; i < images.size(); i++) {
                WritableMap map = new WritableNativeMap();
                String url = images.get(i);
                map.putString("path", "file://" + url);
                BitmapFactory.Options options = new BitmapFactory.Options();
                options.inJustDecodeBounds = true;
                BitmapFactory.decodeFile(url, options);
                map.putInt("width", options.outWidth);
                map.putInt("height", options.outHeight);
                resultCollector.notifySuccess(map);
            }
        }
    }

    private void multPickerCrop(final Intent data) {
        List<LocalMedia> list = PictureSelector.obtainMultipleResult(data);
        resultCollector.setWaitCount(list.size());
        for (int i = 0; i < list.size(); i++) {
            WritableMap map = new WritableNativeMap();
            LocalMedia item = list.get(i);
            if (item.getPictureType().contains("video")) {
                resultCollector.notifySuccess(resolveVideoReslut(item));
            } else {
                String url = item.getPath();
                if (!TextUtils.isEmpty(item.getCutPath())) {
                    url = item.getCutPath();
                }
                map.putString("path", "file://" + url);
                BitmapFactory.Options options = new BitmapFactory.Options();
                options.inJustDecodeBounds = true;
                BitmapFactory.decodeFile(url, options);
                map.putInt("width", options.outWidth);
                map.putInt("height", options.outHeight);
                map.putString("type", "image");
                resultCollector.notifySuccess(map);
            }
        }
    }


    private WritableMap resolveVideoReslut(LocalMedia localMedia) {
        WritableMap map = new WritableNativeMap();
        map.putString("path", "file://" + localMedia.getPath());
        map.putInt("width", localMedia.getWidth());
        map.putInt("height", localMedia.getHeight());
        map.putString("type", localMedia.getPictureType());
        map.putDouble("videoTime", localMedia.getDuration());
        resultCollector.notifySuccess(map);
        return map;
    }

    private void singleEdit(Intent data) {
        if (data == null) {
            resultCollector.notifyProblem(E_CANNOT_LAUNCH_CAMERA, "cancel");
            return;
        }
        String path = data.getStringExtra(EXTRA_IMAGE_SAVE_PATH);
        if (TextUtils.isEmpty(path)) {
            resultCollector.notifyProblem(E_CANNOT_LAUNCH_CAMERA, "Cannot launch camera");
        } else {
            resultCollector.setWaitCount(1);
            WritableMap map = new WritableNativeMap();
            map.putString("path", "file://" + path);
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inJustDecodeBounds = true;
            BitmapFactory.decodeFile(path, options);
            map.putInt("width", options.outWidth);
            map.putInt("height", options.outHeight);
            resultCollector.notifySuccess(map);
        }
    }

    public void resolveCamera(final int resultCode, Intent data) {
        if (data == null) {
            return;
        }
        if (resultCode == RES_CAMERA_PICTURE) {
            String path = data.getStringExtra("path");
            resultCollector.setWaitCount(1);
            WritableMap map = new WritableNativeMap();
            map.putString("path", "file://" + path);
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inJustDecodeBounds = true;
            BitmapFactory.decodeFile(path, options);
            map.putInt("width", options.outWidth);
            map.putInt("height", options.outHeight);
            resultCollector.notifySuccess(map);
        }
        if (resultCode == RES_CAMERA_VIDEO) {
            String path = data.getStringExtra("path");
        }
        if (resultCode == RES_CAMERA_ERR) {
            //请检查相机权限
            Toast.makeText(reactContext, "请检查相机权限", Toast.LENGTH_SHORT).show();
        }

    }

    @Override
    public void onActivityResult(Activity activity, final int requestCode, final int resultCode, final Intent data) {
        if (requestCode == IMAGE_PICKER_REQUEST) {
            imagePickerResult(activity, requestCode, resultCode, data);
        } else if (requestCode == CAMERA_PICKER_REQUEST) {
            cameraPickerResult(activity, requestCode, resultCode, data);
        } else if (requestCode == UCrop.REQUEST_CROP) {
            croppingResult(activity, requestCode, resultCode, data);
        } else if (requestCode == MULTIPLE_IMAGE_PICKER_REQUEST) {
            if (resultCode == CustomerGalleryActivity.MULTIPLE_IMAGE_PICKER_RESULT) {
                multPickerResult(false, data);
            } else {
                multPickerResult(true, null);
            }
        } else if (requestCode == PictureConfig.CHOOSE_REQUEST) {
            multPickerCrop(data);
        } else if (requestCode == REQ_IMAGE_EDIT) {
            singleEdit(data);
        } else if (requestCode == REQ_CAMERA) {
            resolveCamera(resultCode, data);
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
    }

    private boolean isCameraAvailable(Activity activity) {
        return activity.getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA) || activity.getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA_ANY);
    }

    private File createImageFile() throws IOException {

        String imageFileName = "image-" + UUID.randomUUID().toString();
        File path = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES);

        if (!path.exists() && !path.isDirectory()) {
            path.mkdirs();
        }

        File image = File.createTempFile(imageFileName, ".jpg", path);

        // Save a file: path for use with ACTION_VIEW intents
        mCurrentPhotoPath = "file:" + image.getAbsolutePath();

        return image;

    }

    private static WritableMap getCroppedRectMap(Intent data) {
        final int DEFAULT_VALUE = -1;
        final WritableMap map = new WritableNativeMap();

        map.putInt("x", data.getIntExtra(UCrop.EXTRA_OUTPUT_OFFSET_X, DEFAULT_VALUE));
        map.putInt("y", data.getIntExtra(UCrop.EXTRA_OUTPUT_OFFSET_Y, DEFAULT_VALUE));
        map.putInt("width", data.getIntExtra(UCrop.EXTRA_OUTPUT_IMAGE_WIDTH, DEFAULT_VALUE));
        map.putInt("height", data.getIntExtra(UCrop.EXTRA_OUTPUT_IMAGE_HEIGHT, DEFAULT_VALUE));

        return map;
    }
}
