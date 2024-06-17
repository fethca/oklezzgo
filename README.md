# oklezzgo

Movie library based on [Senscritique](https://www.senscritique.com/search?page=1) and TMDB. It allows to filter movies based on different criteria such as rating, genre, country etc. A web version is available [here](https://oklezzgo.jeremy-grijol.com/). The project is also compatible with [Tauri](https://tauri.app/), the executables will be released soon.

## Prerequisites

Before installing oklezzgo, ensure you have the following prerequisites met:

- Node.js installed on your system
- pnpm package manager installed
- A [movie-api](https://github.com/fethca/movie-api)
- Tauri configurations such as rust, see [here](https://tauri.app/v1/guides/getting-started/prerequisites)

### Installation

To install the required node modules for oklezzgo, run the following command:

```sh
pnpm install
```

### Environment Setup

Create a `.env` file at the root directory of your project and include the following environment variables:

```
VITE_API_URL=url

```

On deploy this variable is replaced by the docker-compose one with the [entrypoint.sh](https://github.com/fethca/oklezzgo/blob/main/entrypoint.sh) script 

### In development features

- User profile with custom settings
- Handle browser history
- Retrieve Senscritique user account to filter seen/unseen movies and user's rating
- Launching movie on avaiable providers like Netflix or Amazon
