import React, { Component } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import { withStyles, Button, Tab, Tabs, IconButton, FormLabel, RadioGroup, FormControlLabel, Radio, Divider } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import { FormControl, InputLabel, FormHelperText } from '@material-ui/core';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import PropTypes from 'prop-types';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import FilledInput from '@material-ui/core/FilledInput';
import Snackbar from '@material-ui/core/Snackbar';
import Fade from '@material-ui/core/Fade';
import CloseIcon from '@material-ui/icons/Close';
import { Redirect } from 'react-router-dom'
import 'font-awesome/css/font-awesome.min.css';
import Header from '../../common/header/Header';
import '../checkout/Checkout.css'

const styles = (theme => ({
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
  stepper: {
    'padding-top': '0px'
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
  tab: {
    "font-weight": 500,
    '@media (max-width:600px)': {
      width: '50%',
    }
  },
  gridList: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
  },
  gridListTile: {
    textAlign: 'left',
    margin: '30px 0px 20px 0px',
    'border-style': 'solid',
    'border-width': '0.5px 3px 3px 0.5px',
    'border-radius': '10px',
    'padding': '8px',
    '@media(max-width:600px)': {
      width: '50%',
    }
  },
  addressCheckButton: {
    'float': 'right',
  },
  saveAddressForm: {
    width: '60%',
    'padding': '20px',
    textAlign: 'left',
  },
  selectField: {
    width: '100%',
  },
  formControl: {
    width: '200px',
  },
  formButton: {
    'font-weight': 400,
    'width': '150px'
  },
  cardContent: {
    'padding-top': '0px',
    'margin-left': '10px',
    'margin-right': '10px'
  },
  summaryHeader: {
    'margin-left': '10px',
    'margin-right': '10px'
  },
  restaurantName: {
    'font-size': '18px',
    'color': 'rgb(85,85,85)',
    margin: '10px 0px 10px 0px'
  },
  menuItemName: {
    'margin-left': '10px',
    color: 'grey'
  },
  itemQuantity: {
    'margin-left': '10%',
    color: 'grey'
  },
  placeOrderButton: {
    'font-weight': '400'
  },
  divider: {
    'margin': '10px 0px'
  },
  couponInput: {
    'width': '150px',
    '@media(min-width:1300px)': {
      width: '200px',
    },
    '@media(max-width:600px)': {
      width: '250px',
    }
  },
  applyButton: {
    height: '40px'
  }
}))

const TabContainer = function (props) {
  return (
    <Typography className={props.className} component="div">
      {props.children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
}

class Checkout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeStep: 0,
      steps: this.getSteps(),
      value: 0,
      accessToken: sessionStorage.getItem('access-token'),
      addresses: [],
      selectedAddress: "",
      flatBuildingName: "",
      flatBuildingNameRequired: "dispNone",
      locality: "",
      localityRequired: "dispNone",
      city: "",
      cityRequired: "dispNone",
      selectedState: "",
      stateRequired: "dispNone",
      pincode: "",
      pincodeRequired: "dispNone",
      pincodeHelpText: "dispNone",
      states: [],
      selectedPayment: "",
      payment: [],
      cartItems: props.location.cartItems,
      restaurantDetails: props.location.restaurantDetails,
      coupon: null,
      couponName: "",
      couponNameRequired: "dispNone",
      couponNameHelpText: "dispNone",
      snackBarOpen: false,
      snackBarMessage: "",
      transition: Fade,
      isLoggedIn: sessionStorage.getItem('access-token') === null ? false : true,
    }
  }

  getSteps = () => {
    return ['Delivery', 'Payment'];
  }
  nextButtonClickHandler = () => {
    if (this.state.value === 0) {
      if (this.state.selectedAddress !== "") {
        let activeStep = this.state.activeStep;
        activeStep++;
        this.setState({
          ...this.state,
          activeStep: activeStep,
        });
      } else {
        this.setState({
          ...this.state,
          snackBarOpen: true,
          snackBarMessage: "Select Address"
        })
      }
    }
  }

  backButtonClickHandler = () => {
    let activeStep = this.state.activeStep;
    activeStep--;
    this.setState({
      ...this.state,
      activeStep: activeStep,
    });
  }

  changeButtonClickHandler = () => {
    this.setState({
      ...this.state,
      activeStep: 0,
    });
  }

  tabsChangeHandler = (event, value) => {
    this.setState({
      value,
    });
  }

  radioChangeHandler = (event) => {
    this.setState({
      ...this.state,
      selectedPayment: event.target.value,
    })
  }

  componentDidMount() {

    if (this.state.isLoggedIn) {
      this.getAllAddress();


      let statesData = null;
      let xhrStates = new XMLHttpRequest();
      let that = this;
      xhrStates.addEventListener("readystatechange", function () {
        if (xhrStates.readyState === 4 && xhrStates.status === 200) {
          let states = JSON.parse(xhrStates.responseText).states;
          that.setState({
            ...that.state,
            states: states,
          })
        }
      })

      xhrStates.open('GET', this.props.baseUrl + 'states');
      xhrStates.send(statesData);

      let paymentData = null;
      let xhrPayment = new XMLHttpRequest();
      xhrPayment.addEventListener("readystatechange", function () {
        if (xhrPayment.readyState === 4 && xhrPayment.status === 200) {
          let payment = JSON.parse(xhrPayment.responseText).paymentMethods;
          that.setState({
            ...that.state,
            payment: payment,
          })
        }
      })

      xhrPayment.open('GET', this.props.baseUrl + 'payment');
      xhrPayment.send(paymentData);
    }
  }


  getAllAddress = () => {
    let data = null;
    let that = this;
    let xhrAddress = new XMLHttpRequest();

    xhrAddress.addEventListener('readystatechange', function () {
      if (xhrAddress.readyState === 4 && xhrAddress.status === 200) {
        let responseAddresses = JSON.parse(xhrAddress.responseText).addresses;
        let addresses = [];
        if (responseAddresses && responseAddresses.length > 0) {
          responseAddresses.forEach(responseAddress => {
            let address = {
              id: responseAddress.id,
              city: responseAddress.city,
              flatBuildingName: responseAddress.flat_building_name,
              locality: responseAddress.locality,
              pincode: responseAddress.pincode,
              state: responseAddress.state,
              selected: false,
            }
            addresses.push(address)
          })
        }
        that.setState({
          ...that.state,
          addresses: addresses
        })
      }
    })

    xhrAddress.open('GET', this.props.baseUrl + 'address/customer');
    xhrAddress.setRequestHeader('authorization', 'Bearer ' + this.state.accessToken)
    xhrAddress.send(data);

  }
  saveAddressClickHandler = () => {
    if (this.saveAddressFormValid()) {
      let newAddressData = JSON.stringify({
        "city": this.state.city,
        "flat_building_name": this.state.flatBuildingName,
        "locality": this.state.locality,
        "pincode": this.state.pincode,
        "state_uuid": this.state.selectedState,
      })

      let xhrSaveAddress = new XMLHttpRequest();
      let that = this;

      xhrSaveAddress.addEventListener("readystatechange", function () {
        if (xhrSaveAddress.readyState === 4 && xhrSaveAddress.status === 201) {
          that.setState({
            ...that.state,
            value: 0,

          })
          that.getAllAddress();
        }
      })

      xhrSaveAddress.open('POST', this.props.baseUrl + 'address')
      xhrSaveAddress.setRequestHeader('authorization', 'Bearer ' + this.state.accessToken)
      xhrSaveAddress.setRequestHeader("Content-Type", "application/json");
      xhrSaveAddress.send(newAddressData);
    }
  }

  saveAddressFormValid = () => {
    let flatBuildingNameRequired = "dispNone";
    let cityRequired = "dispNone";
    let localityRequired = "dispNone";
    let stateRequired = "dispNone";
    let pincodeRequired = "dispNone";
    let pincodeHelpText = "dispNone";
    let saveAddressFormValid = true;

    if (this.state.flatBuildingName === "") {
      flatBuildingNameRequired = "dispBlock";
      saveAddressFormValid = false;
    }

    if (this.state.locality === "") {
      localityRequired = "dispBlock";
      saveAddressFormValid = false;
    }

    if (this.state.selectedState === "") {
      stateRequired = "dispBlock";
      saveAddressFormValid = false;
    }

    if (this.state.city === "") {
      cityRequired = "dispBlock";
      saveAddressFormValid = false;
    }

    if (this.state.pincode === "") {
      pincodeRequired = "dispBlock";
      saveAddressFormValid = false;
    }
    if (this.state.pincode !== "") {
      var pincodePattern = /^\d{6}$/;
      if (!this.state.pincode.match(pincodePattern)) {
        pincodeHelpText = "dispBlock";
        saveAddressFormValid = false;
      }
    }
    this.setState({
      ...this.state,
      flatBuildingNameRequired: flatBuildingNameRequired,
      cityRequired: cityRequired,
      localityRequired: localityRequired,
      stateRequired: stateRequired,
      pincodeRequired: pincodeRequired,
      pincodeHelpText: pincodeHelpText,
    })

    return saveAddressFormValid
  }


  inputFlatBuildingNameChangeHandler = (event) => {
    this.setState({
      ...this.state,
      flatBuildingName: event.target.value,
    })
  }
  inputLocalityChangeHandler = (event) => {
    this.setState({
      ...this.state,
      locality: event.target.value,
    })
  }
  inputCityChangeHandler = (event) => {
    this.setState({
      ...this.state,
      city: event.target.value,
    })
  }
  selectSelectedStateChangeHandler = (event) => {
    this.setState({
      ...this.state,
      selectedState: event.target.value,
    })
  }
  inputPincodeChangeHandler = (event) => {
    this.setState({
      ...this.state,
      pincode: event.target.value,
    })
  }

  inputCouponNameChangeHandler = (event) => {
    this.setState({
      ...this.state,
      couponName: event.target.value,
    })
  }
  applyButtonClickHandler = () => {
    let isCouponNameValid = true;
    let couponNameRequired = "dispNone";
    let couponNameHelpText = "dispNone";
    if (this.state.couponName === "") {
      isCouponNameValid = false;
      couponNameRequired = "dispBlock";
      this.setState({
        couponNameRequired: couponNameRequired,
        couponNameHelpText: couponNameHelpText,
      })
    }

    if (isCouponNameValid) {
      let couponData = null;
      let that = this;
      let xhrCoupon = new XMLHttpRequest();
      xhrCoupon.addEventListener("readystatechange", function () {
        if (xhrCoupon.readyState === 4) {
          if (xhrCoupon.status === 200) {
            let coupon = JSON.parse(xhrCoupon.responseText)
            that.setState({
              ...that.state,
              coupon: coupon,
            })
          } else {
            that.setState({
              ...that.state,
              couponNameHelpText: "dispBlock",
              couponNameRequired: "dispNone"
            })
          }
        }
      })

      xhrCoupon.open('GET', this.props.baseUrl + '/order/coupon/' + this.state.couponName)
      xhrCoupon.setRequestHeader('authorization', 'Bearer ' + this.state.accessToken)
      xhrCoupon.setRequestHeader("Content-Type", "application/json");
      xhrCoupon.setRequestHeader("Cache-Control", "no-cache");
      xhrCoupon.send(couponData);
    }

  }


  placeOrderButtonClickHandler = () => {
    let item_quantities = [];
    this.state.cartItems.forEach(cartItem => {
      item_quantities.push({
        'item_id': cartItem.id,
        'price': cartItem.totalAmount,
        'quantity': cartItem.quantity,
      });
    })
    let newOrderData = JSON.stringify({
      "address_id": this.state.selectedAddress,
      "bill": Math.floor(Math.random() * 100),
      "coupon_id": this.state.coupon.id,
      "discount": this.getDiscountAmount(),
      "item_quantities": item_quantities,
      "payment_id": this.state.selectedPayment,
      "restaurant_id": this.state.restaurantDetails.id,
    })
    let that = this;
    let xhrOrder = new XMLHttpRequest();
    xhrOrder.addEventListener("readystatechange", function () {
      if (xhrOrder.readyState === 4) {
        if (xhrOrder.status === 201) {
          let responseOrder = JSON.parse(xhrOrder.responseText)
          that.setState({
            ...that.state,
            snackBarOpen: true,
            snackBarMessage: "Order placed successfully! Your order ID is " + responseOrder.id,
          });
        } else {
          that.setState({
            ...that.state,
            snackBarOpen: true,
            snackBarMessage: "Unable to place your order! Please try again!",
          });
        }
      }
    })
    xhrOrder.open('POST', this.props.baseUrl + 'order')
    xhrOrder.setRequestHeader('authorization', 'Bearer ' + this.state.accessToken)
    xhrOrder.setRequestHeader('Content-Type', 'application/json');
    xhrOrder.send(newOrderData);
  }


  addressSelectedClickHandler = (addressId) => {
    let addresses = this.state.addresses;
    let selectedAddress = "";
    addresses.forEach(address => {
      if (address.id === addressId) {
        address.selected = true;
        selectedAddress = address.id;
      } else {
        address.selected = false;
      }
    })
    this.setState({
      ...this.state,
      addresses: addresses,
      selectedAddress: selectedAddress
    })
  }
  getSubTotal = () => {
    let subTotal = 0;
    this.state.cartItems.forEach(cartItem => {
      subTotal = subTotal + cartItem.totalAmount;
    })
    return subTotal;
  }

  getDiscountAmount = () => {
    let discountAmount = 0;
    if (this.state.coupon !== null) {
      discountAmount = (this.getSubTotal() * this.state.coupon.percent) / 100;
      return discountAmount
    }
    return discountAmount;
  }
  getNetAmount = () => {
    let netAmount = this.getSubTotal() - this.getDiscountAmount();
    return netAmount;
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
  redirectToHome = () => {
    if (!this.state.isLoggedIn) {
      return <Redirect to="/" />
    }
  }
  afterLogoutRedirectToHome = () => {
    this.setState({
      ...this.state,
      isLoggedIn: false,
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.redirectToHome()}
        <Header baseUrl={this.props.baseUrl} showHeaderSearchBox={false} logoutRedirect={this.afterLogoutRedirectToHome} />
        <div className="checkout-container">
          <div className="stepper-container">
            <Stepper activeStep={this.state.activeStep} orientation="vertical" className={classes.stepper}>
              {this.state.steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    {index === 0 ?
                      <div className="address-container">
                        <Tabs className="address-tabs" value={this.state.value} onChange={this.tabsChangeHandler}>
                          <Tab label="EXISTING ADDRESS" className={classes.tab} />
                          <Tab label="NEW ADDRESS" className={classes.tab} />
                        </Tabs>
                        {this.state.value === 0 &&
                          <TabContainer>
                            {this.state.addresses.length !== 0 ?
                              <GridList className={classes.gridList} cols={3} spacing={2} cellHeight='auto'>
                                {this.state.addresses.map(address => (
                                  <GridListTile className={classes.gridListTile} key={address.id} style={{ borderColor: address.selected ? "rgb(224,37,96)" : "white" }}>
                                    <div className="grid-list-tile-container">
                                      <Typography variant="body1" component="p">{address.flatBuildingName}</Typography>
                                      <Typography variant="body1" component="p">{address.locality}</Typography>
                                      <Typography variant="body1" component="p">{address.city}</Typography>
                                      <Typography variant="body1" component="p">{address.state.state_name}</Typography>
                                      <Typography variant="body1" component="p">{address.pincode}</Typography>
                                      <IconButton className={classes.addressCheckButton} onClick={() => this.addressSelectedClickHandler(address.id)}>
                                        <CheckCircleIcon style={{ color: address.selected ? "green" : "grey" }} />
                                      </IconButton>
                                    </div>
                                  </GridListTile>
                                ))}
                              </GridList>
                              :
                              <Typography variant="body1" component="p">There are no saved addresses! You can save an address using the 'New Address' tab or using your ???Profile??? menu option.</Typography>
                            }
                          </TabContainer>
                        }
                        {this.state.value === 1 &&
                          <TabContainer className={classes.saveAddressForm}>
                            <FormControl required className={classes.formControl}>
                              <InputLabel htmlFor="flat-building-name">Flat / Building No.</InputLabel>
                              <Input id="flat-building-name" className="input-fields" flatbuildingname={this.state.flatBuildingName} fullWidth={true} onChange={this.inputFlatBuildingNameChangeHandler} value={this.state.flatBuildingName} />
                              <FormHelperText className={this.state.flatBuildingNameRequired}>
                                <span className="red">required</span>
                              </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <FormControl className={classes.formControl}>
                              <InputLabel htmlFor="locality">Locality</InputLabel>
                              <Input id="locality" className="input-fields" locality={this.state.locality} fullWidth={true} onChange={this.inputLocalityChangeHandler} value={this.state.locality} />
                              <FormHelperText className={this.state.localityRequired}>
                                <span className="red">required</span>
                              </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <FormControl required className={classes.formControl}>
                              <InputLabel htmlFor="city">City</InputLabel>
                              <Input id="city" className="input-fields" type="text" city={this.state.city} fullWidth={true} onChange={this.inputCityChangeHandler} value={this.state.city} />
                              <FormHelperText className={this.state.cityRequired}>
                                <span className="red">required</span>
                              </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <FormControl required className={classes.formControl}>
                              <InputLabel htmlFor="state">State</InputLabel>
                              <Select id="state" className={classes.selectField} state={this.state.selectedState} onChange={this.selectSelectedStateChangeHandler} MenuProps={{ style: { marginTop: '50px', maxHeight: '300px' } }} value={this.state.selectedState}>
                                {this.state.states.map(state => (
                                  <MenuItem value={state.id} key={state.id} >{state.state_name}</MenuItem>
                                ))}
                              </Select>
                              <FormHelperText className={this.state.stateRequired}>
                                <span className="red">required</span>
                              </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <FormControl required className={classes.formControl}>
                              <InputLabel htmlFor="pincode">Pincode</InputLabel>
                              <Input id="pincode" className="input-fields" pincode={this.state.pincode} fullWidth={true} onChange={this.inputPincodeChangeHandler} value={this.state.pincode} />
                              <FormHelperText className={this.state.pincodeRequired}>
                                <span className="red">required</span>
                              </FormHelperText>
                              <FormHelperText className={this.state.pincodeHelpText}>
                                <span className="red">Pincode must contain only numbers and must be 6 digits long</span>
                              </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <br />
                            <Button variant="contained" className={classes.formButton} color="secondary" onClick={this.saveAddressClickHandler}>SAVE ADDRESS</Button>
                          </TabContainer>
                        }
                      </div>
                      :
                      <div className="payment-container">
                        <FormControl component="fieldset" className={classes.radioFormControl}>
                          <FormLabel component="legend">
                            Select Mode of Payment
                                                    </FormLabel>
                          <RadioGroup aria-label="payment" name="payment" value={this.state.selectedPayment} onChange={this.radioChangeHandler}>
                            {this.state.payment.map(payment => (
                              <FormControlLabel key={payment.id} value={payment.id} control={<Radio />} label={payment.payment_name} />
                            ))
                            }
                          </RadioGroup>
                        </FormControl>
                      </div>
                    }


                    <div className={classes.actionsContainer}>
                      <div>
                        <Button
                          disabled={this.state.activeStep === 0}
                          onClick={this.backButtonClickHandler}
                          className={classes.button}
                        >
                          Back
                                                </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={this.nextButtonClickHandler}
                          className={classes.button}
                        >
                          {this.state.activeStep === this.state.steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                      </div>
                    </div>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {this.state.activeStep === this.state.steps.length && (
              <Paper square elevation={0} className={classes.resetContainer}>
                <Typography>View the summary and place your order now!</Typography>
                <Button onClick={this.changeButtonClickHandler} className={classes.button}>
                  Change
                             </Button>
              </Paper>
            )}

          </div>
          <div className="summary-container">
            <Card className={classes.summary}>
              <CardHeader
                title="Summary"
                titleTypographyProps={{
                  variant: 'h5'
                }}
                className={classes.summaryHeader}
              />
              <CardContent className={classes.cardContent}>
                <Typography variant='subtitle1' component='p' className={classes.restaurantName}>{this.state.restaurantDetails.name}</Typography>
                {this.state.cartItems.map(cartItem => (
                  <div className="menu-item-container" key={cartItem.id}>
                    <i className="fa fa-stop-circle-o" aria-hidden="true" style={{ color: cartItem.itemType === "NON_VEG" ? "#BE4A47" : "#5A9A5B" }}></i>
                    <Typography variant="subtitle1" component="p" className={classes.menuItemName} id="summary-menu-item-name" >{cartItem.name[0].toUpperCase() + cartItem.name.slice(1)}</Typography>
                    <Typography variant="subtitle1" component="p" className={classes.itemQuantity}>{cartItem.quantity}</Typography>
                    <div className="summary-item-price-container">
                      <i className="fa fa-inr" aria-hidden="true" style={{ color: 'grey' }}></i>
                      <Typography variant="subtitle1" component="p" className={classes.itemPrice} id="summary-item-price">{cartItem.totalAmount.toFixed(2)}</Typography>
                    </div>
                  </div>
                ))}
                <div className="coupon-container">
                  <FormControl className={classes.formControlCoupon}>
                    <InputLabel htmlFor="coupon">Coupon Code</InputLabel>
                    <FilledInput id="coupon" className={classes.couponInput} value={this.state.couponName} onChange={this.inputCouponNameChangeHandler} placeholder="Ex: FLAT30" />
                    <FormHelperText className={this.state.couponNameRequired}>
                      <span className="red">required</span>
                    </FormHelperText>
                    <FormHelperText className={this.state.couponNameHelpText}>
                      <span className="red">invalid coupon</span>
                    </FormHelperText>
                  </FormControl>
                  <Button variant="contained" color="default" className={classes.applyButton} onClick={this.applyButtonClickHandler} size="small">APPLY</Button>
                </div>
                <div className="label-amount-container">
                  <Typography variant="subtitle2" component="p" style={{ color: 'grey' }}>Sub Total</Typography>
                  <div className="amount">
                    <i className="fa fa-inr" aria-hidden="true" style={{ color: 'grey' }}></i>
                    <Typography variant="subtitle1" component="p" style={{ color: 'grey' }} id="summary-net-amount">{this.getSubTotal().toFixed(2)}</Typography>
                  </div>
                </div>
                <div className="label-amount-container">
                  <Typography variant="subtitle2" component="p" className={classes.netAmount} style={{ color: 'grey' }}>Discount</Typography>
                  <div className="amount">
                    <i className="fa fa-inr" aria-hidden="true" style={{ color: 'grey' }}></i>
                    <Typography variant="subtitle1" component="p" style={{ color: 'grey' }} id="summary-net-amount">{this.getDiscountAmount().toFixed(2)}</Typography>
                  </div>
                </div>


                <Divider className={classes.divider} />
                <div className="label-amount-container">
                  <Typography variant="subtitle2" component="p" className={classes.netAmount}>Net Amount</Typography>
                  <div className="amount">
                    <i className="fa fa-inr" aria-hidden="true" style={{ color: 'grey' }}></i>
                    <Typography variant="subtitle1" component="p" className={classes.itemPrice} id="summary-net-amount">{this.getNetAmount().toFixed(2)}</Typography>
                  </div>
                </div>

                <Button variant="contained" color='primary' fullWidth={true} className={classes.placeOrderButton} onClick={this.placeOrderButtonClickHandler}>PLACE ORDER</Button>

              </CardContent>

            </Card>
          </div>
        </div>
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
            action={
              <IconButton color='inherit' onClick={this.snackBarClose}>
                <CloseIcon />
              </IconButton>
            }
          />
        </div>
      </div >
    )
  }
}

export default withStyles(styles)(Checkout);