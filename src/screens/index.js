import React from 'react';
import { StackNavigator } from 'react-navigation';
import { TouchableOpacity, Text } from 'react-native';
import Auth from '../containers/Auth';
import Search from '../components/Search';
import StepOneContainer from '../containers/StepOneContainer';
import AddPlayers from '../containers/AddPlayers';
import Profile from '../containers/Profile';
import TeamName from '../components/TeamName';
import TeamNameContainer from '../containers/TeamNameContainer';
import CreateRoom from '../containers/CreateRoom';
import Room from '../containers/Room';
import TabNavigator from '../containers/TabNavigator';
import AddObserver from '../containers/AddObserver';

const Screens = StackNavigator({
  Login: {
    screen: Auth,
    navigationOptions: {
      title: 'Login',
    },
  },
  AddObserver: {
    screen: AddObserver,
    navigationOptiosssns: {
      title: 'Add Observer',
    },
  },
  SignUp: {
    screen: Auth,
    navigationOptiosssns: {
      title: 'Register',
    },
  },
  Room: {
    screen: Room,
    navigationOptions: {
      title: 'Room',
    },
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      title: 'Profile',
      // headerLeft: null,
    },
  },
  CreateRoom: {
    screen: CreateRoom,
    navigationOptions: {
      title: 'Room Settings',
    },
  },

  CreateTeamStepOne: {
    screen: AddPlayers,
    navigationOptions: {
      title: 'Add Players',
      // headerLeft: (
      //   <TouchableOpacity>
      //     <Text>cancel</Text>
      //   </TouchableOpacity>
      // ),
    },
  },
  CreateTeamStepTwo: {
    screen: TeamNameContainer,
    navigationOptions: {
      title: 'Team Name',
      // headerLeft: (
      //   <TouchableOpacity>
      //     <Text>cancel</Text>
      //   </TouchableOpacity>
      // ),
    },
  },

  JoinTeam: {
    screen: Search,
    navigationOptions: {
      title: 'Join Team',
      headerRight: (
        <TouchableOpacity>
          <Text>Join</Text>
        </TouchableOpacity>
      ),
    },
  },
  Setup: {
    screen: StepOneContainer,
  },
});
export default Screens;
