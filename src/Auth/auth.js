class auth {
    constructor() {
        this.auth = sessionStorage.getItem('adminAccount') ? JSON.parse(sessionStorage.getItem('adminAccount')).isLogin : false;
    }
    login(cb) {
        this.auth = true;
        cb();
    }
    logout(cb){
        this.auth = false;
        cb();
    }
    isAuth(){
        return this.auth;
    }
}
export default new auth();