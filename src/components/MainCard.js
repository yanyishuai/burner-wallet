import React from 'react';
import { Flex, Button, Icon, OutlineButton, Box } from 'rimble-ui';
import i18next from 'i18next';

export default ({
  ERC20TOKEN,
  changeView,
}) => {
  let sendButtons = (
    <Box>
      <Flex mx={-2}>
        <Box width={[1, 1 / 2, 1 / 2]} m={2}>
          <Button fullWidth onClick={() => changeView('receive')}>
            <Flex alignItems="center">
              <Icon name="CenterFocusWeak" mr={2} />
              {i18next.t('main_card.receive')}
            </Flex>
          </Button>
        </Box>
        <Box width={[1, 1 / 2, 1 / 2]} m={2}>
          <Button fullWidth onClick={() => changeView('send_to_address')}>
            <Flex alignItems="center">
              <Icon name="Send" mr={2} />
              {i18next.t('main_card.send')}
            </Flex>
          </Button>
        </Box>
      </Flex>
      <Flex mx={-2}>
        <Box width={[1, 1 / 2, 1 / 2]} m={2}>
          <OutlineButton fullWidth onClick={() => changeView('apps')}>
            <Flex alignItems="center">
              <Icon name="Games" mr={2} />
              Apps
            </Flex>
          </OutlineButton>
        </Box>
        <Box width={[1, 1 / 2, 1 / 2]} m={2}>
          <OutlineButton fullWidth onClick={() => changeView('send_with_link')}>
            <Flex alignItems="center">
              <Icon name="AttachMoney" mr={2} />
              {i18next.t('main_card.link')}
            </Flex>
          </OutlineButton>
        </Box>
      </Flex>
    </Box>
  );

  if (ERC20TOKEN) {
    sendButtons = (
      <Box>
        <Flex mx={-2}>
          <Box width={[1, 1 / 2, 1 / 2]} m={2}>
            <Button fullWidth onClick={() => changeView('receive')}>
              <Flex alignItems="center">
                <Icon name="CenterFocusWeak" mr={2} />
                {i18next.t('main_card.receive')}
              </Flex>
            </Button>
          </Box>
          <Box width={[1, 1 / 2, 1 / 2]} m={2}>
            <Button fullWidth onClick={() => changeView('send_to_address')}>
              <Flex alignItems="center">
                <Icon name="Send" mr={2} />
                {i18next.t('main_card.send')}
              </Flex>
            </Button>
          </Box>
        </Flex>
        <Flex mx={-2}>
          <Box width={[1, 1 / 2, 1 / 2]} m={2}>
            <OutlineButton fullWidth onClick={() => changeView('apps')}>
              <Flex alignItems="center">
                <Icon name="Games" mr={2} />
                Apps
              </Flex>
            </OutlineButton>
          </Box>
          <Box width={[1, 1 / 2, 1 / 2]} m={2}>
            <OutlineButton fullWidth onClick={() => changeView('vendors')}>
              <Flex alignItems="center">
                <Icon name="AttachMoney" mr={2} />
                {i18next.t('main_card.vendors')}
              </Flex>
            </OutlineButton>
          </Box>
        </Flex>
      </Box>
    );
  }

  return (
    <Box pt={0}>
      {sendButtons}
    </Box>
  );
};
