import React, { Component } from 'react';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import SearchIcon from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Modal from 'react-modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types';
import { FormControl, InputLabel, FormHelperText } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import Fade from '@material-ui/core/Fade';
import './Header.css';

const styles = (theme => ({
    searchText: {
        'color': 'white',
        '&:after': {
            borderBottom: '2px solid white',
        }
    },
    loginButton: {
        "font-weight": 400,
    },
    formButton: {
        "font-weight": 400,
    },
    tab: {
        "font-weight": 400,
    },
    formControl: {
        "width": "80%",
    }
}))
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};
const TabContainer = function (props) {
    return (
        <Typography component="div" style={{ padding: '0px', textAlign: 'center' }}>
            {props.children}
        </Typography>
    )
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}

class Header extends Component {

    constructor() {
        super();
        this.state = {
            isModalOpen: false,
            value: 0,
            loginContactNo: "",
            loginContactNoRequired: "dispNone",
            loginPassword: "",
            loginPasswordRequired: "dispNone",
            firstName: "",
            firstNameRequired: "dispNone",
            lastName: "",
            email: "",
            emailRequired: "dispNone",
            signUpPassword: "",
            signUpPasswordRequired: "dispNone",
            signUpContactNo: "",
            signUpContactNoRequired: "dispNone",
            inValidContact: "dispNone",
            invalidPassword: "dispNone",
            notRegisteredContact: "dispNone",
            validPasswordHelpText: "dispNone",
            contactNoRegistered: "dispNone",
            contactHelpText: "dispNone",
            snackBarOpen: false,
            snackBarMessage: "",
            transition: Fade,
            loggedIn: false,
        }

    }

    closeModalHandler = () => {
        this.setState({
            ...this.state,
            isModalOpen: false
        })
    }

    loginButtonClickHandler = () => {
        this.setState({
            ...this.state,
            isModalOpen: true
        })
    }

    closeModalHandler = () => {
        this.setState({
            ...this.state,
            isModalOpen: false
        })
    }

    inputLoginContactNoChangeHandler = (event) => {
        this.setState({
            ...this.state,
            loginContactNo: event.target.value,
        })
    }

    inputLoginPasswordChangeHandler = (event) => {
        this.setState({
            ...this.state,
            loginPassword: event.target.value,
        })
    }

    inputFirstNameChangeHandler = (event) => {
        this.setState({
            ...this.state,
            firstName: event.target.value,
        })
    }
    inputLastNameChangeHandler = (event) => {
        this.setState({
            ...this.state,
            lastName: event.target.value,
        })
    }
    inputEmailChangeHandler = (event) => {
        this.setState({
            ...this.state,
            email: event.target.value,
        })
    }
    inputSignUpPasswordChangeHandler = (event) => {
        this.setState({
            ...this.state,
            signUpPassword: event.target.value,
        })
    }
    inputSignUpContactNoChangeHandler = (event) => {
        this.setState({
            ...this.state,
            signUpContactNo: event.target.value,
        })
    }

    tabsChangeHandler = (event, value) => {
        this.setState({
            value
        });
    }

    loginClickHandler = () => {
        this.state.loginContactNo === "" ? this.setState({ loginContactNoRequired: "dispBlock" }) : this.setState({ loginContactNoRequired: "dispNone" });
        this.state.loginPassword === "" ? this.setState({ loginPasswordRequired: "dispBlock" }) : this.setState({ loginPasswordRequired: "dispNone" });
        if (this.state.loginContactNo !== "") {
            var contactNo = "[7-9][0-9]{9}";
            this.state.loginContactNo.match(contactNo) ? this.setState({ inValidContact: "dispNone" }) : this.setState({ inValidContact: "dispBlock" });
        }
        if (this.state.inValidContact === "dispNone" && this.state.loginPassword !== "") {
            let dataLogin = null;
            let xhrLogin = new XMLHttpRequest();
            let that = this;
            xhrLogin.addEventListener("readystatechange", function () {
                if (this.readyState === 4 ) {
                    var parseData = JSON.parse(this.responseText)
                    console.log(xhrLogin.status)
                    console.log(parseData);
                    sessionStorage.setItem("uuid", JSON.parse(this.responseText).id);
                    sessionStorage.setItem("access-token", xhrLogin.getResponseHeader("access-token"));
                    console.log(xhrLogin.getResponseHeader("access-token"))

                    that.setState({
                        ...this.state,
                        snackBarMessage: "Logged in successfully!",
                        snackBarOpen: true,
                    })
                    that.closeModalHandler();
                }
            })
            xhrLogin.open("POST", this.props.baseUrl + "customer/login");
            xhrLogin.setRequestHeader("Authorization", "Basic " + window.btoa(this.state.loginContactNo + ":" + this.state.loginPassword));
            xhrLogin.setRequestHeader("Content-Type", "application/json");
            xhrLogin.setRequestHeader("Cache-Control", "no-cache");
            xhrLogin.send(dataLogin);
        }
    }

    signUpClickHandler = () => {
        this.setState({
            ...this.state,
            value: 0,
            snackBarMessage: "Registered successfully! Please login now!",
            snackBarOpen: true,
        })

    }



    snackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            ...this.state,
            snackBarMessage: "",
            snackBarOpen: false,
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <header className="app-header">
                    <FastfoodIcon className="app-logo" fontSize="large" htmlColor="white" />
                    <span className="app-header-search-box">
                        <Input className={classes.searchText}
                            startAdornment={
                                <InputAdornment position="start">
                                    <SearchIcon id="app-header-search-icon" htmlColor="white"></SearchIcon>
                                </InputAdornment>
                            }
                            fullWidth={true} placeholder="Search by Restaurant Name" />
                    </span>
                    <Button className={classes.loginButton} size="large" variant="contained">
                        <AccountCircle className="login-button-icon" onClick={this.loginButtonClickHandler} />
          LOGIN
        </Button>
                </header>
                <Modal
                    ariaHideApp={false}
                    isOpen={this.state.isModalOpen}
                    contentLabel="Login"
                    onRequestClose={this.closeModalHandler}
                    style={customStyles}
                >
                    <Tabs className="login-modal-tabs" value={this.state.value} onChange={this.tabsChangeHandler}>
                        <Tab label="LOGIN" className={classes.tab} />
                        <Tab label="SIGNUP" className={classes.tab} />
                    </Tabs>
                    {this.state.value === 0 &&
                        <TabContainer>
                            <FormControl required className={classes.formControl}>
                                <InputLabel htmlFor="login-contact-no">Contact No.</InputLabel>
                                <Input id="login-contact-no" className="input-fields" fullWidth={true} type="text" logincontactno={this.state.loginContactNo} onChange={this.inputLoginContactNoChangeHandler}  value={this.state.loginContactNo} />
                                <FormHelperText className={this.state.loginContactNoRequired}>
                                    <span className='red'>required</span>
                                </FormHelperText>
                                <FormHelperText className={this.state.inValidContact}>
                                    <span className="red">Invalid Contact</span>
                                </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <FormControl required className={classes.formControl}>
                                <InputLabel htmlFor="login-password">Password</InputLabel>
                                <Input id="login-password" className="input-fields" type="password" loginpassword={this.state.loginPassword} fullWidth={true} onChange={this.inputLoginPasswordChangeHandler} value={this.state.loginPassword} />
                                <FormHelperText className={this.state.loginPasswordRequired}>
                                    <span className='red'>required</span>
                                </FormHelperText>
                                <FormHelperText className={this.state.invalidPassword}>
                                    <span className="red">Invalid Credentials</span>
                                </FormHelperText>
                                <FormHelperText className={this.state.notRegisteredContact}>
                                    <span className="red">This contact number has not been registered!</span>
                                </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <br />
                            <Button variant="contained" className={classes.formButton} color="primary" onClick={this.loginClickHandler}>LOGIN</Button>
                        </TabContainer>
                    }
                    {this.state.value === 1 &&
                        <TabContainer>
                            <FormControl required className={classes.formControl}>
                                <InputLabel htmlFor="first-name">First Name</InputLabel>
                                <Input id="first-name" className="input-fields" firstname={this.state.firstName} fullWidth={true} onChange={this.inputFirstNameChangeHandler} value={this.state.firstName} />
                                <FormHelperText className={this.state.firstNameRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="last-name">Last Name</InputLabel>
                                <Input id="last-name" className="input-fields" lastname={this.state.lastName} fullWidth={true} onChange={this.inputLastNameChangeHandler} value={this.state.lastName} />
                            </FormControl>
                            <br />
                            <br />
                            <FormControl required className={classes.formControl}>
                                <InputLabel htmlFor="email">Email</InputLabel>
                                <Input id="email" className="input-fields" type="email" email={this.state.email} fullWidth={true} onChange={this.inputEmailChangeHandler} value={this.state.email} />
                                <FormHelperText className={this.state.emailRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <FormControl required className={classes.formControl}>
                                <InputLabel htmlFor="sign-up-password">Password</InputLabel>
                                <Input id="sign-up-password" className="input-fields"  type="password" signuppassword={this.state.signUpPassword} fullWidth={true} onChange={this.inputSignUpPasswordChangeHandler} value={this.state.signUpPassword} />
                                <FormHelperText className={this.state.signUpPasswordRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                                <FormHelperText className={this.state.validPasswordHelpText}>
                                    <span className="red">Password must contain at least one capital letter, one small letter, one number, and one special character</span>
                                </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <FormControl required className={classes.formControl}>
                                <InputLabel htmlFor="sign-up-contactNo">Contact No.</InputLabel>
                                <Input id="sign-up-contactNo" className="input-fields" signupcontactno={this.state.signUpContactNo} fullWidth={true} onChange={this.inputSignUpContactNoChangeHandler} value={this.state.signUpContactNo} />
                                <FormHelperText className={this.state.signUpContactNoRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                                <FormHelperText className={this.state.contactHelpText}>
                                    <span className="red">Contact No. must contain only numbers and must be 10 digits long</span>
                                </FormHelperText>
                                <FormHelperText className={this.state.contactNoRegistered}>
                                    <span className="red">This contact number is already registered! Try other contact number.</span>
                                </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <br />
                            <Button variant="contained" className={classes.formButton} color="primary" onClick={this.signUpClickHandler}>SIGNUP</Button>
                        </TabContainer>
                    }
                </Modal>
                <div>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        open={this.state.snackBarOpen}
                        autoHideDuration={4000}
                        onClose={this.snackBarClose}
                        TransitionComponent={this.state.transition}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id">{this.state.snackBarMessage}</span>}
                    />
                </div>
            </div>

        )
    }
}

export default withStyles(styles)(Header);