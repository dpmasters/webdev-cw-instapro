const personalKey = "dmitriy-panfilov";
const baseHost = "https://webdev-api.sky.pro";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts
    });
}

export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}

export function addPost({ token, description, imageUrl }) {
  const commentInputElement = document.getElementById('description')
  return fetch(postsHost, {
    method: 'POST',
    body: JSON.stringify({
      description,
      imageUrl,
    }),
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if (response.status === 400) {
      alert('Необходимо добавить фото и комментарий')
    } else {
      return response.json();
    }
  });
}



export function getUserPosts({ token, userid }) {
  return fetch(postsHost + `/user-posts/${userid}`, {
      method: 'GET',
      headers: {
          Authorization: token,
      },
  })
      .then((response) => {
          if (response.status === 401) {
              throw new Error('Нет авторизации')
          }
          return response.json();
      })
      .then((data) => {
        
          return data.posts;
      })
      .catch((error) => {
          alert('Пропал интернет, попробуйте позже')

      });
}

export function setLike({ token, postId }) {
  return fetch(`${postsHost}/${postId}/like`, {
      method: 'POST',
      headers: {
          Authorization: token,
      },
  }).then((response) => {
      if (response.status === 401) {
        alert('Поставить лайк можно только поcле авторизации');
          throw new Error('Нет авторизации')
      }
      return response.json();
  });
}
export function removeLike({ token, postId }) {
  return fetch(`${postsHost}/${postId}/dislike`, {
      method: 'POST',
      headers: {
          Authorization: token,
      },
  }).then((response) => {
      if (response.status === 401) {
        alert('Сначала аторизуйтесь');
          throw new Error('Нет авторизации')
      }
      return response.json();
  });
}

export function deletePost({ token, id }) {
  return fetch(`${postsHost}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if (response.ok) {
      location.reload();
    } else {
      throw new Error('Ошибка удаления поста');
    }
  })
  .catch((error) => {
    console.error(error);
  });
}