import { removeLike, setLike } from "../api.js";
import { getToken, posts, renderApp } from "../index.js";



// export const likedUsers = ({ elementLikesLength, elementLikes }) => {
//     if (elementLikesLength === 1) {
//         return elementLikes.name;
//     } else if (elementLikesLength > 1) {
//         return `<strong>${elementLikes.name}</strong> и ещё <strong>${(elementLikesLength - 1)}</strong>`;
//     } else {
//         return elementLikesLength;
//     }
// };

export const likeEventListener = () => {
    const likeButtons = document.querySelectorAll(".like-button");

    likeButtons.forEach(likeButton => {
        likeButton.addEventListener("click", (event) => {
            event.stopPropagation();
            const postId = likeButton.dataset.postId;
            const index = likeButton.dataset.index;

            if (posts[index].isLiked) {
                removeLike({ token: getToken(), postId })
                    .then(() => {
                        posts[index].isLiked = false;
                        renderAppp();
                    })
            } else {
                setLike({ token: getTokenoken(), postId })
                    .then(() => {
                        posts[index].isLiked = true;
                        renderApp();
                    })
            }
        })
    });
};