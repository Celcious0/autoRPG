import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { firebaseConfig } from '../config.js';

export default class AuthService {
  static #initialized = false;
  static #auth;

  /** Firebase 초기화 */
  static async init() {
    if (this.#initialized) return;
    const app      = initializeApp(firebaseConfig);
    this.#auth      = getAuth(app);
    this.#initialized = true;
  }

  /** 이메일/비밀번호 로그인 */
  static async login(email, password) {
    const cred = await signInWithEmailAndPassword(this.#auth, email, password);
    return cred.user.getIdToken();
  }

  /** 이메일/비밀번호 회원가입 (닉네임 프로필 업데이트 포함) */
  static async signUp(nickname, email, password) {
    const cred = await createUserWithEmailAndPassword(this.#auth, email, password);
    // 닉네임(displayName) 저장
    await updateProfile(cred.user, { displayName: nickname });
    return cred.user.getIdToken();
  }

  /** 로그아웃 */
  static async logout() {
    return signOut(this.#auth);
  }

  /** 현재 로그인된 사용자의 토큰 획득 */
  static getToken() {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(this.#auth, user => {
        if (user) {
          user.getIdToken().then(resolve).catch(reject);
        } else {
          reject(new Error('Not authenticated'));
        }
      });
    });
  }

  static async getAuthContext() {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(this.#auth, async user => {
        if (!user) return reject(new Error('login required'));
        try {
          const token = await user.getIdToken(true);
          resolve({ uid: user.uid, token });
        } catch (e) {
          reject(e);
        }
      });
    });
  }
}