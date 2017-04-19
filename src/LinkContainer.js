// This is largely taken from react-router/lib/Link.
import React from 'react';
import PropTypes from 'prop-types';

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(
    event.metaKey ||
    event.altKey ||
    event.ctrlKey ||
    event.shiftKey
  );
}

function createLocationDescriptor(to, query, hash, state) {
  if (query || hash || state) {
    return { pathname: to, query, hash, state };
  }

  return to;
}

const propTypes = {
  onlyActiveOnIndex: PropTypes.bool.isRequired,
  to: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  query: PropTypes.string,
  hash: PropTypes.string,
  state: PropTypes.object,
  action: PropTypes.oneOf([
    'push',
    'replace',
  ]).isRequired,
  onClick: PropTypes.func,
  active: PropTypes.bool,
  target: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const contextTypes = {
  router: PropTypes.object,
};

const defaultProps = {
  onlyActiveOnIndex: false,
  action: 'push',
};

class LinkContainer extends React.Component {
  onClick = (event) => {
    const {
      to, query, hash, state, children, onClick, target, action,
    } = this.props;

    if (children.props.onClick) {
      children.props.onClick(event);
    }

    if (onClick) {
      onClick(event);
    }

    if (
      target ||
      event.defaultPrevented ||
      isModifiedEvent(event) ||
      !isLeftClickEvent(event)
    ) {
      return;
    }

    event.preventDefault();

    this.context.router[action](
      createLocationDescriptor(to, query, hash, state)
    );
  };

  render() {
    const { router } = this.context;
    const { onlyActiveOnIndex, to, children, ...props } = this.props;

    props.onClick = this.onClick;

    // Ignore if rendered outside Router context; simplifies unit testing.
    if (router) {
      props.href = router.createHref(to);

      if (props.active == null) {
        props.active = router.isActive(to, onlyActiveOnIndex);
      }
    }

    return React.cloneElement(React.Children.only(children), props);
  }
}

LinkContainer.propTypes = propTypes;
LinkContainer.contextTypes = contextTypes;
LinkContainer.defaultProps = defaultProps;

export default LinkContainer;
