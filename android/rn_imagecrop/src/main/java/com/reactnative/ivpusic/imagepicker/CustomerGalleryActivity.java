package com.reactnative.ivpusic.imagepicker;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AbsListView;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.GridView;
import android.widget.ImageView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by xzm on 17-3-1.
 */

public class CustomerGalleryActivity extends AppCompatActivity {
    private List<ImageModel> mImageList;//相册图片
    private LayoutInflater mLayoutInflater;
    private GridView mGridView;
    private Adapter mAdapter;
    private ImageWork mImageWork;//图片加载类
    private Button button;
    private ImageView back;

    public static final int MULTIPLE_IMAGE_PICKER_RESULT = 61113;
    private int checkCount = 0;
    private int allCount = 9;
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_customer_gallery);
        allCount = getIntent().getIntExtra("allCount",9);
        init();
    }

    void init(){
        try{
            mImageWork = new ImageWork(this);
            mLayoutInflater = LayoutInflater.from(this);
            mImageList = ImagesUtils.getImages(this);
            mGridView = (GridView)findViewById(R.id.gv_main);
            button = (Button)findViewById(R.id.button);
            back = (ImageView)findViewById(R.id.id_iv_back);
            button.setEnabled(false);
            mAdapter = new Adapter();
            mGridView.setAdapter(mAdapter);
            mGridView.setOnScrollListener(new AbsListView.OnScrollListener() {
                @Override
                public void onScrollStateChanged(AbsListView absListView, int scrollState) {
                    // Pause fetcher to ensure smoother scrolling when flinging
                    if (scrollState == AbsListView.OnScrollListener.SCROLL_STATE_FLING) {
                        // Before Honeycomb pause image loading on scroll to help with performance
                        if (!ImagesUtils.hasHoneycomb()) {
                            mImageWork.setPauseWork(true);
                        }
                    } else {
                        mImageWork.setPauseWork(false);
                    }
                }

                @Override
                public void onScroll(AbsListView absListView, int firstVisibleItem,
                                     int visibleItemCount, int totalItemCount) {
                }
            });



            back.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    finish();
                }
            });

            button.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    ArrayList<String> paths = new ArrayList<String>();
                    for(int i = 0;i<mImageList.size();i++){
                        ImageModel imageModel = mImageList.get(i);
                        if(imageModel.getIsChecked()){
                           paths.add(imageModel.getPath());
                        }
                    }

                    Intent intent = new Intent();
                    intent.putExtra("urls",paths);
                    setResult(MULTIPLE_IMAGE_PICKER_RESULT,intent);
                    finish();

                }
            });
        }catch (Exception e){
            Log.e("CustomerGalleryActivity",e.toString());
        }
    }


private void checkedCount(){
    int i = 0;
    for (int j = 0;j<mImageList.size();j++){
        ImageModel imageModel = mImageList.get(j);

        if(imageModel.getIsChecked()){
            i+=1;
        }

    }

    checkCount = i;

    if(i == 0){
        button.setEnabled(false);
        button.setBackgroundResource(R.drawable.gallery_right_button);
        button.setText("发送");
    }else {
        button.setEnabled(true);
        button.setBackgroundResource(R.drawable.gallery_right_enable_button);
        button.setText("发送（"+checkCount+"/"+allCount+")");
    }

}

    private class Adapter extends BaseAdapter {

        @Override
        public int getCount() {
            return mImageList.size();
        }

        @Override
        public Object getItem(int i) {
            return mImageList.get(i);
        }

        @Override
        public long getItemId(int i) {
            return i;
        }

        @Override
        public View getView(final int i, View view, ViewGroup viewGroup) {
            ViewHolder viewHolder;
            final ImageModel imageModel = (ImageModel)getItem(i);
            String path = imageModel.getPath();
            boolean checked = imageModel.getIsChecked();
            if(view == null){
                viewHolder = new ViewHolder();
                view = mLayoutInflater.inflate(R.layout.imageview,null);
                viewHolder.imageView = (ImageView)view.findViewById(R.id.iv_imageView);
                viewHolder.checkBox = (CheckBox)view.findViewById(R.id.cb_imageview);
                view.setTag(viewHolder);
            }else{
                viewHolder = (ViewHolder)view.getTag();
            }

            viewHolder.imageView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(CustomerGalleryActivity.this,ImageDetail.class);
                    intent.putExtra("index",i+1+"");
                    intent.putExtra("all",mImageList.size()+"");
                    intent.putExtra("path",imageModel.getPath());
                    startActivity(intent);
                }
            });

            viewHolder.checkBox.setOnTouchListener(new View.OnTouchListener() {
                @Override
                public boolean onTouch(View v, MotionEvent event) {

                    if(checkCount == allCount && !imageModel.getIsChecked()){
                        if(event.getAction() == MotionEvent.ACTION_UP) {
                            Toast.makeText(CustomerGalleryActivity.this, "你最多只能上传"+allCount+"张图片！", Toast.LENGTH_SHORT).show();
                        }
                        return true;
                    }
                    return false;
                }
            });



            viewHolder.checkBox.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
                @Override
                public void onCheckedChanged(CompoundButton arg0, boolean arg1) {
                    imageModel.setIsChecked(arg1);
                    checkedCount();
                }
            });
            viewHolder.checkBox.setChecked(checked);
            mImageWork.loadImage(path, viewHolder.imageView);
            return view;
        }

        class ViewHolder{
            ImageView imageView;
            CheckBox checkBox;
        }
    }

}
