import { VuexModule, Module, Mutation } from 'vuex-module-decorators';
import { IAccount } from '../types';

@Module({ namespaced: true, name: 'user' })
class User extends VuexModule {
  public account: IAccount = {
    server: '',
    web: '',
    user: '',
    pass: '',
  };

  @Mutation
  public setAccount(value: IAccount): void {
    this.account = value;
  }
}
export default User;
