import React, {Component} from 'react';
import { connect } from 'react-redux';

import './App.css';
import Routes from './containers/Routes';
import Footer from './components/Footer/Footer';
import NavOne from "./components/NavBar/NavOne";
import NavTwo from "./components/NavBar/NavTwo";
import {auth} from "./firebase/firebase";
import {setCurrentUser, setRole} from "./redux/user/user-action";
import {setLoading} from "./redux/spinner/spinner-actions";
import UserService from "./services/UserService";
import {createStructuredSelector} from "reselect";
import {selectCurrentUser, selectRole, selectUserProfile} from "./redux/user/user-selectors";
import {userRole} from "./utils";
import ProductService from "./services/ProductService";
import {setAllProducts} from "./redux/product/product-action";
import {setSideBarFilters} from "./redux/filters/filters-actions";
import VendorService from "./services/VendorService";
import {setAllOrders, setCustomerOrders} from "./redux/orders/order-action";
import OrderService from "./services/OrderService";


class App extends Component {
    unsubscribeFromAuth = null;
    constructor(props) {
        super(props);
        this.state = {profile: null};
    }
    componentDidMount () {
        const { setCurrentUser,setLoading ,setRole,setAllProducts,setSideBarFilters,setAllOrders,setCustomerOrders} = this.props;
        this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
            setLoading(true);
            setCurrentUser(userAuth);
            if (userAuth)
            {
                const userProfile =await UserService.getUser(userAuth.uid)
                await setRole(userRole(userProfile));
                await this.setState({profile : userProfile})
            }
            setLoading(false);
            const products = await ProductService.getProductList()
            const orders = await OrderService.getVendorOrder()
            const customer_orders = await OrderService.getCustomerOrder()
            const vendors = await VendorService.getVendorNames()
            setAllProducts(products)
            setAllOrders(orders)
            setCustomerOrders(customer_orders)
            setSideBarFilters({staticBrands: [...vendors]});
        });
    }
    componentWillUnmount() {
        this.unsubscribeFromAuth();
    }
    render() {
        return (
            <div className="App">
                <header>
                    <NavOne />
                    <NavTwo /> {/*{this.props.role==='vendor' && <NavThree/>}*/}
                   {/*<NavThree/>*/}
                </header>
                <Routes />
                <footer className="footer-distributed">
                    <Footer/>
                </footer>
            </div>
        );
    }
}
const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    role: selectRole,
    profile: selectUserProfile,
});
const mapDispatchToProps = dispatch => ({
    setCurrentUser: user => dispatch(setCurrentUser(user)),
    setLoading: loadingState => dispatch(setLoading(loadingState)),
    setRole: role => dispatch(setRole(role)),
    setAllProducts : products => dispatch(setAllProducts(products)),
    setCustomerOrders : customer_orders => dispatch(setCustomerOrders(customer_orders)),
    setSideBarFilters: newValues => dispatch(setSideBarFilters(newValues)),
    setAllOrders : orders => dispatch(setAllOrders(orders)),

});
export default connect(mapStateToProps, mapDispatchToProps)(App);
