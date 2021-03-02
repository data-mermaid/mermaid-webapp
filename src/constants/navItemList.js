import {
  IconCollect,
  IconSites,
  IconCopy,
  IconData,
  IconGraph,
  IconAdmin,
  IconUsers,
  IconHeart,
  IconSharing,
} from '../components/icons'

export const navItemList = [
  {
    header: 'Project Overview',
    itemList: [{ path: 'collecting', name: 'Project Health', icon: IconHeart }],
  },
  {
    header: 'Collect',
    itemList: [
      { path: 'collecting', name: 'Collecting', icon: IconCollect },
      { path: 'sites', name: 'Sites', icon: IconSites },
      {
        path: 'management-regimes',
        name: 'Management Regimes',
        icon: IconCopy,
      },
    ],
  },
  {
    header: 'Data',
    itemList: [
      { path: 'data', name: 'Submitted', icon: IconData },
      { path: 'graphs-and-maps', name: 'Graphs and Maps', icon: IconGraph },
    ],
  },
  {
    header: 'Admin',
    itemList: [
      { path: 'admin', name: 'Project Info', icon: IconAdmin },
      { path: 'users', name: 'Users', icon: IconUsers },
      { path: 'fish-families', name: 'Fish Families', icon: IconHeart },
      { path: 'data-sharing', name: 'Data Sharing', icon: IconSharing },
    ],
  },
]
