import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken, renderApp } from "../index.js";
import { removeLike, setLike } from "../api.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { replaceSafe } from "../helpers.js";

export function renderPostsPageComponent({ appEl }) {
  const getApiPosts = posts.length ? posts.map((postItem) => {
    return {
      postImageUrl: postItem.imageUrl,
      date: formatDistanceToNow(new Date(postItem.createdAt), { locale: ru }),
      description: replaceSafe(postItem.description),
      userId: postItem.user.id,
      userName: replaceSafe(postItem.user.name),
      userLogin: postItem.user.login,
      postImageUserUrl: postItem.user.imageUrl,
      usersLikes: postItem.likes,
      isLiked: postItem.isLiked,
	  id: postItem.id,
    };
  }) : [];
  const appHtml = 
  	`<div class="page-container">
		<div class="header-container"></div>
			${ !getApiPosts.length 
					?
						`<div>Постов сейчас нет</div>`
					: getApiPosts.map((postItem, index) => {
						return `<ul class="posts">
					<li class="post" data-index=${index}>
						<div class="post-header" data-user-id="${postItem.userId}">
							<img src="${postItem.postImageUserUrl}" class="post-header__user-image">
							<p class="post-header__user-name">${postItem.userName}</p>
						</div>
						<div class="post-image-container">
							<img class="post-image" data-post-id="${postItem.id}" src="${postItem.postImageUrl}" data-index="${index}">
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
							Нравится: ${postItem.usersLikes.length > 0 ? `${postItem.usersLikes[postItem.usersLikes.length - 1].name}
							${postItem.usersLikes.length - 1 > 0 ? 'и ещё' + (postItem.usersLikes.length - 1) : ''} ` : '0'}
							</p>
						</div>
						</div>
						<p class="post-text">
							<span class="user-name">${postItem.userName}</span>
							${postItem.description}
						</p>
						<p class="post-date">
							${postItem.date} назад
						</p>
					</li>
				</ul >`})}
			</div > `;
  ;

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

export function likeEventListener () {
	const likeButtons = document.querySelectorAll(".like-button")
	likeButtons.forEach(likeButton => {
		likeButton.addEventListener("click", (event) => {
			event.stopPropagation();
			const postId = likeButton.dataset.postId
			const index = likeButton.dataset.index
			if (posts[index].isLiked) {
				removeLike({ token: getToken(), postId })
					.then((updatedPost) => {
						posts[index].isLiked = false;
						posts[index].likes = updatedPost.post.likes;
						renderApp();
					})
			} else {
				setLike({ token: getToken(), postId })
					.then((updatedPost) => {
						posts[index].isLiked = true;
						posts[index].likes = updatedPost.post.likes;
						renderApp();
					})
			}
		})
	});
};
