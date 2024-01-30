import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken } from "../index.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { likeEventListener } from "./add-like-component.js";

export function renderPostsPageComponent({ appEl }) {
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
						<img class="post-image" src="${postItem.postImageUrl} data-index="${index}">
					</div>
					<div class="post-likes">
						<button data-post-id="${
              postItem.postId
            } data-index="${index}" class="like-button">
							<img src="./assets/images/like-active.svg">
						</button>
						<p class="post-likes-text">
						Нравится: <strong>${postItem.likes.length >= 1 ? postItem.likes[0].name : '0'}</strong> ${(postItem.likes.length - 1) > 0 ? 'и ещё' + ' ' + (postItem.likes.length - 1) : ''}
						</p>
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

  likeEventListener();
}
