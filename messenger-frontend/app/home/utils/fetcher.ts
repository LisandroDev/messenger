function updateOptions(options: any) {
    const update = { ...options };
    if (sessionStorage.getItem('tokenjwt')) {
      update.headers = {
        ...update.headers,
        Authorization: `Bearer ${sessionStorage.getItem('tokenjwt')}`,
      };
    }
    return update;
  }
  
  export default function fetcher(url: string, options: any) {
    return fetch(url, updateOptions(options));
  }