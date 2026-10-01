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

displayPosts();

document.getElementById("userIdDisplay").textContent =
    "@" + getUserId();


// =========================
// ＋ボタン
// =========================

openPostButton.addEventListener(
    "click",
    function () {

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
// モーダルの外側をクリック
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

                iconChoices.forEach(
                    function (otherIcon) {

                        otherIcon.classList.remove(
                            "selected"
                        );

                    }
                );

                icon.classList.add("selected");

                selectedIcon = icon.dataset.icon;

            }
        );

    }
);


// =========================
// 投句
// =========================

postButton.addEventListener(
    "click",
    function () {

        // ユーザー情報

        const userName =
            document.getElementById("userName").value;

        const userId = getUserId();


        // 句

        const line1 =
            document.getElementById("line1").value;

        const line2 =
            document.getElementById("line2").value;

        const line3 =
            document.getElementById("line3").value;


        // 入力チェック

        if (
            userName.trim() === "" ||
            line1.trim() === "" ||
            line2.trim() === "" ||
            line3.trim() === ""
        ) {

            alert("名前・一句を入力してな！");

            return;

        }


        // アイコンチェック

        if (selectedIcon === "") {

            alert("アイコンを選択してな！");

            return;

        }


        // 投稿データ

        const post = {

        user: {
            name: userName,
            id: userId,
            icon: selectedIcon
        },

        line1: line1,
        line2: line2,
        line3: line3,


        // 投稿した日時を保存
        createdAt: Date.now()
};


        // 保存されている投稿を取得

        let posts =
            JSON.parse(
                localStorage.getItem("posts")
            ) || [];


        // 新しい投稿を一番上へ

        posts.unshift(post);


        // 保存

        localStorage.setItem(
            "posts",
            JSON.stringify(posts)
        );


        // ポップアップを先に閉じる

        postModal.style.display = "none";


        // 入力欄を空にする

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


        // 投稿を表示

        displayPosts();

    }
);


// =========================
// 投稿を表示する関数
// =========================

function displayPosts() {

    postsDiv.innerHTML = "";

    let posts =
        JSON.parse(
            localStorage.getItem("posts")
        ) || [];

    posts.forEach(
        function (post) {

            postsDiv.innerHTML += `

                <div class="post">

                    <div class="post-user">

                        <img
                            class="post-icon"
                            src="${post.user.icon}"
                            alt="アイコン"
                        >

                        <div class="post-user-info">

                            <div class="post-user-name">
                                ${post.user.name}
                            </div>

                            <div class="post-user-id">
                                ${post.user.id}
                            </div>

                            <div class="post-time">
                                ${post.createdAt
                                    ? new Date(post.createdAt).toLocaleString("ja-JP")
                                    : ""}
                            </div>

                        </div>

                    </div>

                    <div class="line3">
                        ${post.line3}
                    </div>

                    <div class="line2">
                        ${post.line2}
                    </div>

                    <div class="line1">
                        ${post.line1}
                    </div>

                </div>

            `;

        }
    );

}