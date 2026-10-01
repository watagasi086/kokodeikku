
// =========================
// Firebaseの機能を読み込む
// =========================

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from
    "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


// =========================
// Firebaseの設定
// =========================

const firebaseConfig = {
    apiKey: "AIzaSyDb9PkzrVe5MbdAfBpsWZqfW5061b2oEwo",
    authDomain: "kokodeikku-dfb6b.firebaseapp.com",
    projectId: "kokodeikku-dfb6b",
    storageBucket: "kokodeikku-dfb6b.firebasestorage.app",
    messagingSenderId: "721858855686",
    appId: "1:721858855686:web:4e9c15be027776f2909487",
    measurementId: "G-FLEXT9ZTVW"
};


// Firebaseを起動
const app = initializeApp(firebaseConfig);

// Firestoreを使えるようにする
const db = getFirestore(app);


// =========================
// HTMLの要素を取得
// =========================

const openPostButton =
    document.getElementById("openPostButton");

const closePostButton =
    document.getElementById("closePostButton");

const postModal =
    document.getElementById("postModal");

const postButton =
    document.getElementById("postButton");

const postsDiv =
    document.getElementById("posts");

const iconChoices =
    document.querySelectorAll(".icon-choice");

const postError =
    document.getElementById("postError");


// =========================
// ユーザーIDの自動生成
// =========================

function getUserId() {

    let userId = localStorage.getItem("userId");

    if (!userId) {

        userId = "user_" +
            Math.random().toString(36).substring(2, 10);

        localStorage.setItem("userId", userId);

    }

    return userId;
}


// =========================
// 選択中のアイコン
// =========================

let selectedIcon = "";


// =========================
// 起動時
// =========================

document.getElementById("userIdDisplay").textContent =
    "@" + getUserId();


// =========================
// ＋ボタン
// =========================

openPostButton.addEventListener(
    "click",
    function () {

        postError.textContent = "";
        postModal.style.display = "flex";

    }
);


// =========================
// ×ボタン
// =========================

closePostButton.addEventListener(
    "click",
    function () {

        postModal.style.display = "none";

    }
);


// =========================
// ポップアップの外側をクリック
// =========================

postModal.addEventListener(
    "click",
    function (event) {

        if (event.target === postModal) {

            postModal.style.display = "none";

        }

    }
);


// =========================
// アイコンを選択
// =========================

iconChoices.forEach(
    function (icon) {

        icon.addEventListener(
            "click",
            function () {

                // すべての選択状態を解除
                iconChoices.forEach(
                    function (otherIcon) {

                        otherIcon.classList.remove("selected");

                    }
                );

                // 選択したアイコンに印をつける
                icon.classList.add("selected");

                // 画像のパスを保存
                selectedIcon = icon.dataset.icon;

            }
        );

    }
);


// =========================
// 投稿時間を表示する関数
// =========================

function formatPostTime(timestamp) {

    if (!timestamp) {
        return "";
    }

    const date = timestamp.toDate
        ? timestamp.toDate()
        : new Date(timestamp);

    return date.toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
}


// =========================
// 投句
// =========================

postButton.addEventListener(
    "click",
    async function () {

        // =========================
        // 入力内容を取得
        // =========================

        const userName =
            document.getElementById("userName").value.trim();

        const userId = getUserId();

        const line1 =
            document.getElementById("line1").value.trim();

        const line2 =
            document.getElementById("line2").value.trim();

        const line3 =
            document.getElementById("line3").value.trim();


        // =========================
        // 入力チェック
        // =========================

        if (
            userName === "" ||
            line1 === "" ||
            line2 === "" ||
            line3 === ""
        ) {

            postError.textContent =
                "名前と一句をすべて入力してな！";

            return;

        }


        // =========================
        // アイコンチェック
        // =========================

        if (selectedIcon === "") {

            postError.textContent =
                "アイコンを選択してな！";

            return;

        }


        // =========================
        // 投稿ボタンを一時停止
        // =========================

        postButton.disabled = true;
        postButton.textContent = "投稿中...";
        postError.textContent = "";


        try {

            // =========================
            // Firebaseに投稿を保存
            // =========================

            await addDoc(
                collection(db, "posts"),
                {
                    user: {
                        name: userName,
                        id: userId,
                        icon: selectedIcon
                    },

                    line1: line1,
                    line2: line2,
                    line3: line3,

                    createdAt: serverTimestamp()
                }
            );


            // =========================
            // 投稿成功後の処理
            // =========================

            postModal.style.display = "none";

            document.getElementById("userName").value = "";
            document.getElementById("line1").value = "";
            document.getElementById("line2").value = "";
            document.getElementById("line3").value = "";


            // アイコン選択を解除
            iconChoices.forEach(
                function (icon) {

                    icon.classList.remove("selected");

                }
            );

            selectedIcon = "";

        } catch (error) {

            console.error("投稿エラー:", error);

            postError.textContent =
                "投稿できへんかった。通信や設定を確認してな。";

        } finally {

            postButton.disabled = false;
            postButton.textContent = "投句する";

        }

    }
);


// =========================
// 投稿を画面に表示する関数
// =========================

function displayPosts(posts) {

    postsDiv.innerHTML = "";


    // 投稿がない場合
    if (posts.length === 0) {

        const message = document.createElement("p");

        message.className = "loading-message";
        message.textContent = "まだ投稿がないで。一句投稿してみよう！";

        postsDiv.appendChild(message);

        return;

    }


    // 投稿を1件ずつ表示
    posts.forEach(
        function (post) {

            const postElement =
                document.createElement("div");

            postElement.className = "post";


            // =========================
            // 投稿者情報
            // =========================

            const userElement =
                document.createElement("div");

            userElement.className = "post-user";


            // アイコン
            const iconElement =
                document.createElement("img");

            iconElement.className = "post-icon";
            iconElement.src = post.user.icon;
            iconElement.alt = "投稿者アイコン";


            // 名前・ID・時間
            const infoElement =
                document.createElement("div");

            infoElement.className = "post-user-info";


            const nameElement =
                document.createElement("div");

            nameElement.className = "post-user-name";
            nameElement.textContent = post.user.name;


            const idElement =
                document.createElement("div");

            idElement.className = "post-user-id";
            idElement.textContent = "@" + post.user.id;


            const timeElement =
                document.createElement("div");

            timeElement.className = "post-time";
            timeElement.textContent =
                formatPostTime(post.createdAt);


            infoElement.appendChild(nameElement);
            infoElement.appendChild(idElement);
            infoElement.appendChild(timeElement);

            userElement.appendChild(iconElement);
            userElement.appendChild(infoElement);


            // =========================
            // 句を表示
            // =========================

            const line3Element =
                document.createElement("div");

            line3Element.className = "line3";
            line3Element.textContent = post.line3;


            const line2Element =
                document.createElement("div");

            line2Element.className = "line2";
            line2Element.textContent = post.line2;


            const line1Element =
                document.createElement("div");

            line1Element.className = "line1";
            line1Element.textContent = post.line1;


            // =========================
            // 投稿カードに追加
            // =========================

            postElement.appendChild(userElement);

            postElement.appendChild(line3Element);
            postElement.appendChild(line2Element);
            postElement.appendChild(line1Element);

            postsDiv.appendChild(postElement);

        }
    );

}


// =========================
// Firebaseから投稿をリアルタイム取得
// =========================

const postsQuery = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc")
);


onSnapshot(
    postsQuery,

    function (snapshot) {

        const posts = [];

        snapshot.forEach(
            function (documentSnapshot) {

                posts.push(documentSnapshot.data());

            }
        );

        displayPosts(posts);

    },

    function (error) {

        console.error("読み込みエラー:", error);

        postsDiv.innerHTML = "";

        const message = document.createElement("p");

        message.className = "loading-message";
        message.textContent =
            "投稿を読み込めへんかった。Firebaseの設定を確認してな。";

        postsDiv.appendChild(message);

    }
);
