import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { getMenu } from '../../menu_operations';
import { connect } from 'react-redux';
import { setMenu } from '../../store/actions/menu_actions'
import styles from './styles';
import MainContainer from '../main_container/main_container';

class Loading extends Component {
  componentDidMount() {
    this.getData();
  }
  
  getData = async () => {
    let newEntrees = await getMenu('entree');
    let newBeverages = await getMenu('beverage');
    let newDesserts = await getMenu('dessert');
    let newAppetizers = await getMenu('appetizer');

    this.props.setMenu(newEntrees, newBeverages, newDesserts, newAppetizers)  // Set it in redux
  }

  // Add loading until all data is retreived
  renderApp = () => {
    return (
      <MainContainer navigation = {this.props.navigation}/>
    )
  }

  renderLoading = () => {
    return (
      <View style = {styles.loadingTextView}>
        <Text style = {styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  render() {
    let view;

    if (this.props.desserts.length == 0) {
      view = this.renderLoading();
    } else {
      view = this.renderApp();
    }

    return (
      view    
    );
  }
}

const mapStateToProps = (state) => ({
  appetizers: state.menReducer.appetizers,
  beverages:  state.menReducer.beverages,
  entrees:    state.menReducer.entrees,
  desserts:   state.menReducer.desserts
})

export default connect(mapStateToProps, { setMenu })(Loading);