<template>
  <div>
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog as="div" class="relative z-40 md:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </TransitionChild>

        <div class="fixed inset-0 z-40 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
            <DialogPanel class="relative flex w-full max-w-xs flex-1 flex-col bg-indigo-700">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                <div class="absolute top-0 right-0 -mr-12 pt-2">
                  <button type="button" class="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" @click="sidebarOpen = false">
                    <span class="sr-only">{{ $t("sitewide.close_sidebar") }}</span>
                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <div class="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                <div class="flex flex-shrink-0 items-center px-4">
                  <img class="h-8 w-auto" src="/logo.svg" alt="TiltBridge" />
                </div>
                <nav class="mt-5 space-y-1 px-2">
                  <!-- Mobile (small) navigation -->
                  <router-link v-for="item in navigation" :key="item.name" :to="{name: item.route_name}" v-slot="{ href, navigate, isActive }" custom>
                    <a :href="href" :class="[isActive ? 'bg-indigo-800 text-white' : 'text-white hover:bg-indigo-600 hover:bg-opacity-75', 'group flex items-center px-2 py-2 text-base font-medium rounded-md']" @click="navigate">
                      <component :is="item.icon" class="mr-4 h-6 w-6 flex-shrink-0 text-indigo-300" aria-hidden="true" />
                      {{ item.name }}
                    </a>
                  </router-link>
                </nav>
              </div>

            </DialogPanel>
          </TransitionChild>
          <div class="w-14 flex-shrink-0" aria-hidden="true">
            <!-- Force sidebar to shrink to fit close icon -->
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex min-h-0 flex-1 flex-col bg-indigo-700">
        <div class="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div class="flex flex-shrink-0 items-center px-4">
            <img class="h-8 w-auto" src="/logo.svg" alt="TiltBridge" />
          </div>
          <nav class="mt-5 flex-1 space-y-1 px-2">
            <!-- Desktop (big) sidebar navigation -->
            <ul role="list" class="space-y-1">
              <li v-for="item in navigation" :key="item.name">

                <router-link v-if="!item.children" :to="{name: item.route_name}" v-slot="{ href, navigate, isActive }" custom>
                  <a :href="href" :class="[isActive ? 'bg-indigo-800 text-white' : 'text-white hover:bg-indigo-600 hover:bg-opacity-75', 'group flex items-center p-2 text-sm font-medium rounded-md']">
                    <component :is="item.icon" class="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300" aria-hidden="true" />
                    {{ item.name }}
                  </a>
                </router-link>

                <Disclosure as="div" v-else v-slot="{ open }">
                  <DisclosureButton :class="[item.current ? 'bg-indigo-800 text-white' : 'text-white hover:bg-indigo-600 hover:bg-opacity-75', 'group flex items-center p-2 text-sm font-medium rounded-md leading-6 w-full text-left gap-x-3']">
                    <component :is="item.icon" class="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true" />
                    {{ item.name }}
                    <ChevronRightIcon :class="[open ? 'rotate-90 text-gray-500' : 'text-gray-400', 'ml-auto h-5 w-5 shrink-0']" aria-hidden="true" />
                  </DisclosureButton>
                  <DisclosurePanel as="ul" class="mt-1 px-2 space-y-1">
                    <li v-for="subItem in item.children" :key="subItem.name" class="">
                      <!-- 44px -->
                      <router-link :to="{name: subItem.route_name}" v-slot="{ href, navigate, isActive }" custom>
                        <DisclosureButton as="a" :href="href" :class="[isActive ? 'bg-indigo-800 text-white' : 'text-white hover:bg-indigo-600 hover:bg-opacity-75', 'group flex items-center px-4 py-2 text-sm font-medium rounded-md']">{{ subItem.name }}</DisclosureButton>
                      </router-link>
                    </li>
                  </DisclosurePanel>
                </Disclosure>

              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <!-- begin collapsable navbar -->
    <div class="hidden">
      <div class="hidden md:fixed md:flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 md:w-64 md:inset-y-0">
        <div class="flex h-16 shrink-0 items-center">
          <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">

                  <router-link v-if="!item.children" :to="{name: item.route_name}" v-slot="{ href, navigate, isActive }" custom>
                    <a :href="href" :class="[isActive ? 'bg-gray-50' : 'hover:bg-gray-50', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700']">
                      <component :is="item.icon" class="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true" />
                      {{ item.name }}
                    </a>
                  </router-link>

                  <Disclosure as="div" v-else v-slot="{ open }">
                    <DisclosureButton :class="[item.current ? 'bg-gray-50' : 'hover:bg-gray-50', 'flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-gray-700']">
                      <component :is="item.icon" class="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true" />
                      {{ item.name }}
                      <ChevronRightIcon :class="[open ? 'rotate-90 text-gray-500' : 'text-gray-400', 'ml-auto h-5 w-5 shrink-0']" aria-hidden="true" />
                    </DisclosureButton>
                    <DisclosurePanel as="ul" class="mt-1 px-2">
                      <li v-for="subItem in item.children" :key="subItem.name">
                        <!-- 44px -->
                        <!--                      <DisclosureButton as="a" :href="subItem.href" :class="[subItem.current ? 'bg-gray-50' : 'hover:bg-gray-50', 'block rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-gray-700']">{{ subItem.name }}</DisclosureButton>-->

                        <router-link :to="{name: subItem.route_name}" v-slot="{ href, navigate, isActive }" custom>
                          <DisclosureButton as="a" :href="href" :class="[isActive ? 'bg-gray-50' : 'hover:bg-gray-50', 'block rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-gray-700']">{{ subItem.name }}</DisclosureButton>
                          <!--                        <a :href="href" :class="[isActive ? 'bg-gray-50' : 'hover:bg-gray-50', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700']">-->
                          <!--                          <component :is="item.icon" class="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true" />-->
                          <!--                          {{ item.name }}-->
                          <!--                        </a>-->
                        </router-link>

                      </li>
                    </DisclosurePanel>
                  </Disclosure>
                </li>
              </ul>
            </li>
            <li class="-mx-6 mt-auto">
              <a href="#" class="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">
                <img class="h-8 w-8 rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                <span class="sr-only">Your profile</span>
                <span aria-hidden="true">Tom Cook</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- End Collapsable Navbar -->
    <div class="flex flex-1 flex-col md:pl-64">
      <div class="sticky top-0 z-10 bg-gray-100 pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
        <button type="button" class="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" @click="sidebarOpen = true">
          <span class="sr-only">{{ $t("sitewide.open_sidebar") }}</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <main class="flex-1">
        <router-view class="us__content"  />
      </main>
    </div>
  </div>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import {
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'


import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  Bars3Icon,
  HomeIcon,
  XMarkIcon,
  CloudArrowUpIcon,
  CpuChipIcon,
  LightBulbIcon,
  Cog8ToothIcon
} from '@heroicons/vue/24/outline'

import { i18n } from "@/main.js";
import { onBeforeUnmount, onMounted, ref } from "vue";

const sidebarOpen = ref(false);

const navigation = [
  { name: 'Tilts', icon: HomeIcon, route_name: 'Home'},
  { name: i18n.global.t('sitewide.sidebar_options.configure'), icon: Cog8ToothIcon, route_name: 'TiltBridgeConfig'},
  { name: i18n.global.t('sitewide.sidebar_options.cloud_target'), icon: CloudArrowUpIcon, route_name: 'CloudConfigView', children:[
      { name: 'Fermentrack/BrewPi-Remix', route_name: 'FermentrackConfig' },
      { name: 'Google Sheets', route_name: 'GoogleSheetsConfig' },
      { name: 'Brewers Friend', route_name: 'BrewersFriendConfig' },
      { name: 'Brewfather', route_name: 'BrewfatherConfig' },
      { name: 'Grainfather', route_name: 'GrainfatherConfig' },
      { name: 'Brewstatus', route_name: 'BrewstatusConfig' },
      { name: 'Taplist.io', route_name: 'FermentrackConfig' },
      { name: 'MQTT', route_name: 'MQTTConfig' },
      { name: 'Generic Target', route_name: 'FermentrackConfig' }
    ]},
  { name: 'Calibration', icon: HomeIcon, route_name: 'Home'},
  { name: 'Help', icon: HomeIcon, route_name: 'Home'},
  { name: 'About', icon: HomeIcon, route_name: 'Home'},
  // { name: 'About', route_name: 'About'},
]

// const navigation = [
//   { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
//   {
//     name: 'Teams',
//     icon: UsersIcon,
//     current: false,
//     children: [
//       { name: 'Engineering', href: '#' },
//       { name: 'Human Resources', href: '#' },
//       { name: 'Customer Success', href: '#' },
//     ],
//   },
//   {
//     name: 'Projects',
//     icon: FolderIcon,
//     current: false,
//     children: [
//       { name: 'GraphQL API', href: '#' },
//       { name: 'iOS App', href: '#' },
//       { name: 'Android App', href: '#' },
//       { name: 'New Customer Portal', href: '#' },
//     ],
//   },
//   { name: 'Calendar', href: '#', icon: CalendarIcon, current: false },
//   { name: 'Documents', href: '#', icon: DocumentDuplicateIcon, current: false },
//   { name: 'Reports', href: '#', icon: ChartPieIcon, current: false },
// ]


</script>



<style scoped>

</style>