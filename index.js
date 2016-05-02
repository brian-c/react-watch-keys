(function() {
  var React;
  if (typeof require !== 'undefined') {
    React = require('react');
  } else if (typeof window !== 'undefined') {
    React = window.React;
  }

  var WatchedKeyConnector = React.createClass({
    displayName: 'WatchedKeyConnector',

    getDefaultProps: function() {
      return {
        which: {},
        propName: 'heldKeys',
        debug: false
      };
    },

    getInitialState: function() {
      return {
        heldKeys: {}
      };
    },

    componentDidMount: function() {
      addEventListener('keydown', this);
      addEventListener('keyup', this);
    },

    componentWillUnmount: function() {
      removeEventListener('keydown', this);
      removeEventListener('keyup', this);
    },

    handleEvent: function(event) {
      var keyLabel = this.props.which[event.which];

      var heldKeys;
      if (this.props.debug) {
        console.log(event.type, event.which, keyLabel);
      }

      if (keyLabel !== undefined) {
        heldKeys = Object.assign({}, this.state.heldKeys);
        if (event.type === 'keydown') {
          heldKeys[keyLabel] = true;
        } else if (event.type === 'keyup') {
          delete heldKeys[keyLabel];
        }

        this.setState({
          heldKeys: heldKeys
        });
      }
    },

    render: function() {
      var injectedProps = {};
      injectedProps[this.props.propName] = this.state.heldKeys;
      return React.cloneElement(this.props.children, injectedProps);
    }
  });

  // TODO: Figure out decorators. Is this a decorator?  I do not know.
  function watchKeys(whichProp, otherProps) {
    return function(ComponentClass) {
      function WrappedComponent(componentProps) {
        var instance = React.createElement(ComponentClass, componentProps);
        return React.createElement(WatchedKeyConnector, Object.assign({
          which: whichProp
        }, otherProps), instance);
      }

      WrappedComponent.displayName = [
        'WatchedKeysFor',
        ComponentClass.displayName
      ].join('');

      return WrappedComponent;
    }
  }

  watchKeys.WatchedKeyConnector = WatchedKeyConnector;

  if (typeof module !== 'undefined') {
    module.exports = watchKeys;
  } else if (typeof window !== 'undefined') {
    window.reactWatchKeys = watchKeys;
  }
}());
