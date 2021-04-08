import React, {Component} from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import './Header.css';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

const TabContainer = function (props) {
    return (
        <Typography component="div" style={{ padding: 0, textAlign: 'center' }}>
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
            modalIsOpen: false,
            value: 0,
            firstname: "",
            firstnameRequired: "dispNone",
            lastname: "",
            email: "",
            emailRequired: "dispNone",
            registerPassword: "",
            registerPasswordRequired: "dispNone",
            registerContact: "",
            registerContactRequired: "dispNone",
            invalidEmail: "dispNone",
            invalidPassword: "dispNone",
            invalidContact: "dispNone",
            loginContact: "",
            loginContactRequired: "dispNone",
            invalidLoginContact: "dispNone",
            loginPassword: "",
            loginPasswordRequired: "dispNone",
            searchInput: "",
            searchResults: []
        }
    }

    openModalHandler = () => {
        this.setState({
            modalIsOpen: true,
            value: 0,
            firstnameRequired: "dispNone",
            firstname: "",
            lastnameRequired: "dispNone",
            lastname: "",
            emailRequired: "dispNone",
            email: "",
            registerPasswordRequired: "dispNone",
            registerPassword: "",
            registerContactRequired: "dispNone",
            registerContact: "",
            invalidEmail: "dispNone",
            invalidPassword: "dispNone",
            invalidContact: "dispNone",
            loginContact: "",
            loginContactRequired: "dispNone",
            loginPassword: "",
            loginPasswordRequired: "dispNone"
        })
    }

    closeModalHandler = () => {
        this.setState(
            {modalIsOpen: false}
        )
    }

    tabChangeHandler = (event, value) => {
        this.setState({value});
    }

    inputFirstnameChangeHandler = (e) => {
        this.setState({firstname: e.target.value});
    }

    inputLastnameChangeHandler = (e) => {
        this.setState({lastname: e.target.value});
    }

    inputEmailChangeHandler = (e) => {
        this.setState({email: e.target.value});
    }

    inputRegisterPasswordChangeHandler = (e) => {
        this.setState({registerPassword: e.target.value});
    }

    inputRegisterContactChangeHandler = (e) => {
        this.setState({registerContact: e.target.value});
    }

    inputLoginContactChangeHandler = (e) => {
        this.setState({loginContact: e.target.value});
    }

    inputLoginPasswordChangeHandler = (e) => {
        this.setState({loginPassword: e.target.value});
    }

    signupClickHandler = () => {
        this.state.firstname === "" ? this.setState({firstnameRequired: "dispBlock"}) : this.setState({firstnameRequired: "dispNone"});
        this.state.email === "" ? this.setState({emailRequired: "dispBlock"}) : this.setState({emailRequired: "dispNone"});
        this.state.registerPassword === "" ? this.setState({registerPasswordRequired: "dispBlock"}) : this.setState({registerPasswordRequired: "dispNone"});
        this.state.contact === "" ? this.setState({contactRequired: "dispBlock"}) : this.setState({contactRequired: "dispNone"});
    
        var emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        this.state.email.match(emailFormat) ? this.setState({invalidEmail: "dispNone"}) : this.setState({invalidEmail: "dispBlock"});
    
        var registerPasswordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s)$/;
        this.state.registerPassword.match(registerPasswordFormat) ? this.setState({invalidPassword: "dispNone"}) : this.setState({invalidPassword: "dispBlock"});
        console.log(this.state.registerPassword.match(registerPasswordFormat));

        var contactNoFormat = /^\d{10}$/;
        this.state.registerContact.match(contactNoFormat) ? this.setState({invalidContact: "dispNone"}) : this.setState({invalidContact: "dispBlock"});
    }

    loginClickHandler = () => {
        this.state.loginContact === "" ? this.setState({loginContactRequired: "dispBlock"}) : this.setState({loginContactRequired: "dispNone"});
        this.state.loginPassword === "" ? this.setState({loginPasswordRequired: "dispBlock"}) : this.setState({loginPasswordRequired: "dispNone"});
    
        var contactNoFormat = /^\d{10}$/;
        this.state.loginContact.match(contactNoFormat) ? this.setState({invalidLoginContact: "dispNone"}) : this.setState({invalidLoginContact: "dispBlock"});
    }

    searchInputChangeHandler =(e) => {
        this.setState({searchInput: e.target.value});

       /* let xhrSearch = new XMLHttpRequest();
        let that = this;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    searchResults: JSON.parse(this.responseText).movies
                });
            }
        });*/
    }

    render() {
        return (
            <div>
                <header className='app-header'>
                    <div className='logo-container'>
                    <FastfoodIcon
                        className='app-logo'
                    />
                    </div>
                    
                    <div className='search-box-container'>
                        <SearchIcon className='search-icon' style={{color: 'white'}}/>
                        <Input className='search-box-input' 
                        style={{color: 'white'}} 
                        type='text' 
                        disableUnderline 
                        placeholder='Search by Restaurant Name'
                        onChange={this.searchInputChangeHandler}/>
                    </div>

                    <div className='login-btn-container'>
                    <Button className='login-btn' variant='contained' color='default' onClick={this.openModalHandler}>
                        <AccountCircleIcon />
                        LOGIN
                    </Button>
                    </div>                  
                </header>

                <Modal
                    isOpen={this.state.modalIsOpen}
                    contentLabel='Login'
                    ariaHideApp={false}
                    onRequestClose={this.closeModalHandler}>
                    
                    <Tabs value={this.state.value} onChange={this.tabChangeHandler}>
                        <Tab label="LOGIN"/>
                        <Tab label="SIGNUP"/>
                    </Tabs>

                    {this.state.value === 0 &&
                    <TabContainer>
                        <FormControl>
                            <InputLabel htmlFor="login-contact">Contact No.</InputLabel>
                            <Input id="login-contact" type="text" onChange={this.inputLoginContactChangeHandler}/>
                            <FormHelperText className={this.state.loginContactRequired}>
                                <span className='red'>required</span>
                            </FormHelperText>
                            <FormHelperText className={this.state.invalidLoginContact}>
                                <span className='red'>Invalid contact</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />
                        <FormControl>
                            <InputLabel htmlFor="login-password">Password</InputLabel>
                            <Input id="login-password" type="password" onChange={this.inputLoginPasswordChangeHandler}/>
                            <FormHelperText className={this.state.loginPasswordRequired}>
                                <span className='red'>required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />
                        <Button variant='contained' color='primary' onClick={this.loginClickHandler}>
                            LOGIN
                        </Button>
                    </TabContainer>
                    }

                    {this.state.value === 1 &&
                    <TabContainer>
                        <FormControl required>
                            <InputLabel htmlFor="firstname">First Name</InputLabel>
                            <Input id="firstname" type="text" onChange={this.inputFirstnameChangeHandler}/> 
                            <FormHelperText className={this.state.firstnameRequired}>
                                <span className='red'>required</span>
                            </FormHelperText>                           
                        </FormControl>
                        <br /><br />
                        <FormControl >
                            <InputLabel htmlFor="lastname">Last Name</InputLabel>
                            <Input id="lastname" type="text" onChange={this.inputLastnameChangeHandler}/>                          
                        </FormControl>
                        <br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <Input id="email" type="text" onChange={this.inputEmailChangeHandler}/>    
                            <FormHelperText className={this.state.emailRequired}>
                                <span className='red'>required</span>
                            </FormHelperText>  
                            <FormHelperText className={this.state.invalidEmail}>
                                <span className='red'>Invalid Email</span>
                            </FormHelperText>                      
                        </FormControl>
                        <br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="registerPassword">Password</InputLabel>
                            <Input id="registerPassword" type="password" onChange={this.inputRegisterPasswordChangeHandler}/>  
                            <FormHelperText className={this.state.registerPasswordRequired}>
                                <span className='red'>required</span>
                            </FormHelperText>   
                            <FormHelperText className={this.state.invalidPassword}>
                                <span className='red'>Password must contain at least one capital letter, one small letter, one number, and one special character</span>
                            </FormHelperText>                       
                        </FormControl>
                        <br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="contact">Contact No.</InputLabel>
                            <Input id="contact" type="text" onChange={this.inputRegisterContactChangeHandler}/>    
                            <FormHelperText className={this.state.registerContactRequired}>
                                <span className='red'>required</span>
                            </FormHelperText> 
                            <FormHelperText className={this.state.invalidContact}>
                                <span className='red'>Contact No. must contain only numbers and must be 10 digits long</span>
                            </FormHelperText>                        
                        </FormControl>
                        <br /><br />
                        <Button variant='contained' color='primary' onClick={this.signupClickHandler}>
                            SIGNUP
                        </Button>
                    </TabContainer>
                    }

                </Modal>
            </div>
        );
    }
}

export default Header;