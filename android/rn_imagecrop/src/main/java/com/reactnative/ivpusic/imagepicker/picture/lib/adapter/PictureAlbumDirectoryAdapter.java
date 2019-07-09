package com.reactnative.ivpusic.imagepicker.picture.lib.adapter;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.facebook.drawee.view.SimpleDraweeView;
import com.meeruu.commonlib.utils.DensityUtils;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.reactnative.ivpusic.imagepicker.R;
import com.reactnative.ivpusic.imagepicker.picture.lib.config.PictureMimeType;
import com.reactnative.ivpusic.imagepicker.picture.lib.entity.LocalMedia;
import com.reactnative.ivpusic.imagepicker.picture.lib.entity.LocalMediaFolder;

import java.util.ArrayList;
import java.util.List;

/**
 * author：luck
 * project：PictureSelector
 * package：com.luck.picture.adapter
 * email：893855882@qq.com
 * data：16/12/31
 */
public class PictureAlbumDirectoryAdapter extends RecyclerView.Adapter<PictureAlbumDirectoryAdapter.ViewHolder> {
    private Context mContext;
    private List<LocalMediaFolder> folders = new ArrayList<>();
    private int mimeType;
    private int imgW = DensityUtils.dip2px(160);

    public PictureAlbumDirectoryAdapter(Context mContext) {
        super();
        this.mContext = mContext;
    }

    public void bindFolderData(List<LocalMediaFolder> folders) {
        this.folders = folders;
        notifyDataSetChanged();
    }

    public void setMimeType(int mimeType) {
        this.mimeType = mimeType;
    }

    public List<LocalMediaFolder> getFolderData() {
        if (folders == null) {
            folders = new ArrayList<>();
        }
        return folders;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(mContext).inflate(R.layout.picture_album_folder_item, parent, false);
        return new ViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(final ViewHolder holder, int position) {
        final LocalMediaFolder folder = folders.get(position);
        String name = folder.getName();
        int imageNum = folder.getImageNum();
        String imagePath = folder.getFirstImagePath();
        boolean isChecked = folder.isChecked();
        int checkedNum = folder.getCheckedNum();
        holder.tv_sign.setVisibility(checkedNum > 0 ? View.VISIBLE : View.INVISIBLE);
        holder.itemView.setSelected(isChecked);
        if (mimeType == PictureMimeType.ofAudio()) {
            holder.first_image.setImageResource(R.drawable.audio_placeholder);
        } else {
            ImageLoadUtils.loadImageFile(imagePath, imgW, imgW, holder.first_image);
        }
        holder.image_num.setText("(" + imageNum + ")");
        holder.tv_folder_name.setText(name);
        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (onItemClickListener != null) {
                    for (LocalMediaFolder mediaFolder : folders) {
                        mediaFolder.setChecked(false);
                    }
                    folder.setChecked(true);
                    notifyDataSetChanged();
                    onItemClickListener.onItemClick(folder.getName(), folder.getImages());
                }
            }
        });
    }

    @Override
    public int getItemCount() {
        return folders.size();
    }

    class ViewHolder extends RecyclerView.ViewHolder {
        SimpleDraweeView first_image;
        TextView tv_folder_name, image_num, tv_sign;

        public ViewHolder(View itemView) {
            super(itemView);
            first_image = itemView.findViewById(R.id.first_image);
            tv_folder_name = (TextView) itemView.findViewById(R.id.tv_folder_name);
            image_num = (TextView) itemView.findViewById(R.id.image_num);
            tv_sign = (TextView) itemView.findViewById(R.id.tv_sign);
        }
    }

    private OnItemClickListener onItemClickListener;

    public void setOnItemClickListener(OnItemClickListener onItemClickListener) {
        this.onItemClickListener = onItemClickListener;
    }

    public interface OnItemClickListener {
        void onItemClick(String folderName, List<LocalMedia> images);
    }
}
