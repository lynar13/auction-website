// Import the Noroff API class
import { NoroffAPI } from '../api/index.js'; // Adjusted to relative path

const apiInstance = new NoroffAPI();

export default async function router(pathname = window.location.pathname) {
  switch (pathname) {
    case '/auth/login/index.html':
      await import('../ui/auth/login.js');
      break;
    case '/auth/register/index.html':
      await import('../ui/auth/register.js');
      break;
    case '/listing/create/index.html':
      await import('../ui/listing/create.js');
      break;
    case '/listing/edit/index.html':
      await import('../ui/listing/edit.js');
      break;
    case '/listing/index.html':
      await import('../ui/listing/view.js');
      break;
    case '/profile/index.html':
      await import('../ui/profile/profile.js');
      break;
    case '/listings/index.html':
      await import('../ui/listing/viewList.js');
      break;
    default:
      await import('../ui/home/home.js'); // Default home page
  }
}

document.addEventListener('DOMContentLoaded', () => {
  router();
});
