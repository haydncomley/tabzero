import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

export const app = initializeApp();
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export const CONFIG = {
	version: '0.0.1',
	twitch: {
		client_id: 'wf0v2o5emovybh5acdn3s1r9c4g8gj',
		client_secret: 'vaiuqju72iyllyedg575lzsskh1gis',
		redirect_uri: 'https://tabzero.gg/auth',
	},
	google: {
		client_email: 'firebase-adminsdk-fbsvc@tabzero-ai.iam.gserviceaccount.com',
		private_key:
			'-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCpcfY85OEinH3i\ntOKNdoIF4K2C4KpNf9Y1dqEO2E+ObQLyJguB4RqOshZWVdE3Y6pN/8r/dkOG2Ftq\n4eal7jwXP7QQbS6yt3Se5TLjDoY2ywaI0TnSHtuX2RzO86he6AOmUMcY+qU78VCF\nlqqa8aqQ29yUr7o0/c1Dah/x4Aog9idwq7NlV/lJtNYNE0yi3TrUOCv6qMU7ml2j\ney6Tg1fDdGbLbh5XJ0K92zv+pW2uCzRZbiH0ysE3qVDbVv0K21OcAqekMMgnUyLx\nfdUKXpr1bmZuDDXS88Xc+CR+PXeDoMSRraoshcYVsQeU9GM7tWuc+npg8uOhwE/m\nXz9KWmN7AgMBAAECggEABH6v7AScTkk9c6advefvYg2IPMkN63lhKtDnS9gEIECX\nC+pjcsIQbMmfmxGyt5fuvBv1fBpchza1EhxE/JDZyjoX4jmrO/Vu5Aorc+d+OvTe\nywFV2dOUuq35PCothLr94csRxQFdIb5whuKsyuhvQGF8s/sHYwF6kPe/OjDZw+8I\ni9TgZvu9Lpa/R7AhwFd7BLqTP7XbnIKLMWZNh5XG8csg0RlEhdvaE5i6sAoy+E/O\nsmyCLqWY6SSmdWLEF8a6AlRZRd+j+28lznAJCAuLyYOXGkMsy9rnijlpN05z9PO1\nmsoK18bhPzXJtxTbvWNFv4fkiQDaNK/SBW4RphRVVQKBgQDvOUuOTPtTR9iCOXhM\nB/4vLjz/OLc4lfD8I72182HsPXZjo/JQIheNl4uUfZQYHMIKO1Lsv1+gfb5Q2oa6\nQ31iAraxB+ETFdGmQJs9CXlbfYbmp3BDYNIoxGZYzGpnquG6/luDN2VFlnZS0sEP\nBSJXXEXj4Gi5f2cVevdJlAOCRwKBgQC1U/Q/U68o3gPPh2oyYWiG8Ta9+yLCHpuC\nWEbed7zqTFTy/x+uPBMHxDIDuAKIqbBjSp7DW+JSKv/lH8b8rhDjYW9c2GdKARFk\nTtZzLaYsr0okR4/v8CaP5dkTOk2vaOIAcirQ6h+wRHhXtrQztSMSqXSYuelVRg26\n71Tz2YkbLQKBgQDc2x+3U7kgbQ8lQxudzi9MrbqgwmLdegjPL8wg5H7+VMwtN5op\ngyANl+DEiZ+lFz/JpHVtn00Q5aZEDUwfQNnMF8dE74pLTXSNsc3gbxO8dMqLvf/2\nJLhB7Pi0eJyv8uKN+fDQ1t7HfR7mXi7gyBOpZcYcmPz2bPnlqe4N3vnSVwKBgGki\nCiWFcbNyNidnTi1zyNUkmibAq0B92pBSepSWPBRkuYRCY63z6ty/5ne9gsqWCE0p\ngK+oYKpfgArqx8bNbcFIRvdACXMg92J/S1twhj62S3iJfW0SgmlATQIW9d/UIeU8\nTJLgjAr5SAUjS4wHZBR358B9Wko02dUe2tSfthzpAoGBAIwMUJ4NC/4okJWg19Hw\nI8mQK7xTEo/iYGy9ABKFaJjb7fJRLEHp1Ew2ifOJPAFqV77fMbOCCkwXdaemNdmi\n3RtM3KrDqs0W234+BEwBapnkUFzbwnLf7BjchS/ywJPyue8ItJB6scUQZlMLiNkd\nmzdZNUTr4txNZ3Fo8LN7FelA\n-----END PRIVATE KEY-----\n',
		project_id: 'tabzero-ai',
	},
	openai: {
		key: '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',
	},
	stripe: {
		key: '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',
		webhook_secret: 'whsec_FPgEZvwwAP4zlozuuznXSY4GoJewNpjG',
		tiers: {
			base: {
				price_id: 'price_1RSgzIRdSyIS0KuupZLFVqMV',
			},
		}
	}
};
