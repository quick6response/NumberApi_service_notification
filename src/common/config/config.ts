import vkChatConfig from './vk.chats.config';

export default () => ({
  VK_GROUP_TOKEN: process.env.VK_GROUP_TOKEN,
  VK_GROUP_ID: process.env.VK_GROUP_ID,
  ...vkChatConfig,
});
