import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken, user } from "../index.js";
import { deletePost } from "../api.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { likeEventListener } from "./posts-page-component.js";


export function renderUserPostsPageComponent({ appEl }) {
  const getApiPosts = posts.map((postItem) => {
    return {
      postImageUrl: postItem.imageUrl,
      date: formatDistanceToNow(new Date(postItem.createdAt), { locale: ru }),
      description: postItem.description,
      userId: postItem.user.id,
      userName: postItem.user.name,
      userLogin: postItem.user.login,
      postImageUserUrl: postItem.user.imageUrl,
      usersLikes: postItem.likes,
      isLiked: postItem.isLiked,
      id: postItem.id,
    };
  });
  const appHtml = getApiPosts.map((postItem, index) => {
    return `
		<div class="page-container">
        	<div class="header-container"></div>
        	<ul class="posts">
          		<li class="post" data-index=${index}>
					<div class="post-header" data-user-id="${postItem.userId}">
						<img src="${postItem.postImageUserUrl}" class="post-header__user-image">
						<p class="post-header__user-name">${postItem.userName}</p>
					</div>
					<div class="post-image-container">
						<img class="post-image" src="${postItem.postImageUrl}" data-index="${index}">
					</div>
					<div class="post-likes">
						<button data-post-id="${postItem.id}"data-like="${postItem.isLiked ? 'true' : ''}" data-index="${index}" class="like-button">
					<img src=${
					  postItem.isLiked
						  ? './assets/images/like-active.svg'
						  : './assets/images/like-not-active.svg'
				  }>
				  </button> 
						<p class="post-likes-text">
						Нравится: <strong>${
              postItem.usersLikes.length > 0
                ? `${postItem.usersLikes[postItem.usersLikes.length - 1].name}
						${
              postItem.usersLikes.length - 1 > 0
                ? "и ещё" + (postItem.usersLikes.length - 1)
                : ""
            } `
                : "0"
            }
						</p>
            <button class="delete-button" data-post-id="${postItem.id}">
            ${postItem.userId === user?._id ? `<p class="delete">Удалить</p>` : ""} 
					</div>
					
					<p class="post-text">
						<span class="user-name">${postItem.userName}</span>
						${postItem.description}
					</p>
					<p class="post-date">
						${postItem.date}
					</p>
				</li>
			</ul >
     	</div > `;
  });

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
  postDeleteButton();

  likeEventListener();
}

export function postDeleteButton() {
const deleteButtons = document.querySelectorAll(".delete-button");
for (let deleteButton of deleteButtons) {
  deleteButton.addEventListener("click", () => {
	const id = deleteButton.dataset.postId
  console.log();
	deletePost({ token: getToken(), id })
  .then(() => {
      goToPage(USER_POSTS_PAGE, {
        userId: user._id
      })
    })
})
}
}

likeEventListener();