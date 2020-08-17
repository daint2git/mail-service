import { Route, NavigationGuardNext } from 'vue-router';
import webStorage from '../../helpers/webStorage';
import { IAccount } from '../../types';

function checkAuth(to: Route, from: Route, next: NavigationGuardNext): void {
  const routeMatched = to.matched.find(record => record.meta.requiresAuth);
  const account = webStorage.get('tk') as IAccount;

  console.log(routeMatched && account?.user);
  if (routeMatched) {
    if (account?.user) next();
    else next('/login');
  } else next();
}

export default checkAuth;
