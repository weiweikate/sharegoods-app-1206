package com.meeruu.sharegoods.utils.aipay;

import android.util.Log;

import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;

public class SignUtils {

	private static final String ALGORITHM = "RSA";

	private static final String SIGN_ALGORITHMS = "SHA1WithRSA";

	private static final String DEFAULT_CHARSET = "UTF-8";

	public static String sign(String content, String privateKey) {
		try {
			PKCS8EncodedKeySpec priPKCS8 = new PKCS8EncodedKeySpec(
					Base64.decode(privateKey));
			Log.e("----1-----","-_-");
			KeyFactory keyf = KeyFactory.getInstance(ALGORITHM,"BC");
			Log.e("----2-----","-_-");
			PrivateKey priKey = keyf.generatePrivate(priPKCS8);
			Log.e("----3-----","-_-");
			java.security.Signature signature = java.security.Signature
					.getInstance(SIGN_ALGORITHMS);
			Log.e("----4-----","-_-");
			signature.initSign(priKey);
			Log.e("----5-----", "-_-");
			signature.update(content.getBytes(DEFAULT_CHARSET));
			Log.e("----6-----", "-_-");
			byte[] signed = signature.sign();
			Log.e("----7-----","-_-");
			return Base64.encode(signed);
		} catch (Exception e) {
			e.printStackTrace();
			Log.e("----8-----", "-_-");
		}
		Log.e("----9-----","-_-");
		return null;
	}

}
