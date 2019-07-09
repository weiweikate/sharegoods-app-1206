package com.reactnative.ivpusic.imagepicker.picture.lib.entity;

import android.os.Parcel;
import android.os.Parcelable;

public class RefreshSelector  implements Parcelable {
    public String oldPath;
    public String path;

   public RefreshSelector(String oldPath,String path){
       this.oldPath = oldPath;
       this.path = path;
   }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
       dest.writeString(oldPath);
       dest.writeString(path);
    }
    public RefreshSelector(){}

    protected RefreshSelector(Parcel parcel){
       this.oldPath = parcel.readString();
       this.path = parcel.readString();
    }

    public static final Creator<RefreshSelector> CREATOR = new Creator<RefreshSelector>() {
        @Override
        public RefreshSelector createFromParcel(Parcel source) {
            return new RefreshSelector(source);
        }

        @Override
        public RefreshSelector[] newArray(int size) {
            return new RefreshSelector[size];
        }
    };
}
