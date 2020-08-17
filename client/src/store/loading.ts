import { VuexModule, Module, Mutation } from 'vuex-module-decorators';

@Module({ namespaced: true, name: 'loading' })
class Loading extends VuexModule {
  public isLoading = false;

  @Mutation
  public setLoading(value: boolean): void {
    this.isLoading = value;
  }
}
export default Loading;
