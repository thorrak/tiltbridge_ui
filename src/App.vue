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
                  <span v-for="item in navigation" :key="item.name">
                    <router-link v-if="!item.children" :to="{name: item.route_name}" v-slot="{ href, navigate, isActive }" custom>
                      <a :href="href" :class="[isActive ? 'bg-indigo-800 text-white' : 'text-white hover:bg-indigo-600 hover:bg-opacity-75', 'group flex items-center px-2 py-2 text-base font-medium rounded-md']" @click="navigate">
                        <component :is="item.icon" class="mr-4 h-6 w-6 flex-shrink-0 text-indigo-300" aria-hidden="true" />
                        {{ item.name }}
                      </a>
                    </router-link>
                    <span v-else>
                      <span :class="[isActive ? 'bg-indigo-800 text-white' : 'text-white hover:bg-indigo-600 hover:bg-opacity-75', 'group flex items-center px-2 py-2 text-base font-medium rounded-md']">
                        <component :is="item.icon" class="mr-4 h-6 w-6 flex-shrink-0 text-indigo-300" aria-hidden="true" />
                        {{ item.name }}
                      </span>
                      <router-link v-for="subItem in item.children" :key="subItem.name" :to="{name: subItem.route_name}" v-slot="{ href, navigate, isActive }" custom>
                        <a :href="href" :class="[isActive ? 'bg-indigo-800 text-white' : 'text-white hover:bg-indigo-600 hover:bg-opacity-75', 'group flex items-center px-2 py-2 text-base font-medium rounded-md ml-12']" @click="navigate">
<!--                          <component :is="item.icon" class="mr-4 h-6 w-6 flex-shrink-0 text-indigo-300" aria-hidden="true" />-->
                          {{ subItem.name }}
                        </a>
                      </router-link>
                    </span>


                  </span>
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
                  <a :href="href" :class="[isActive ? 'bg-indigo-800 text-white' : 'text-white hover:bg-indigo-600 hover:bg-opacity-75', 'group flex items-center p-2 text-sm font-medium rounded-md']" @click="navigate">
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
                        <DisclosureButton as="a" :href="href" :class="[isActive ? 'bg-indigo-800 text-white' : 'text-white hover:bg-indigo-600 hover:bg-opacity-75', 'group flex items-center px-4 py-2 text-sm font-medium rounded-md']" @click="navigate">{{ subItem.name }}</DisclosureButton>
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

import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  Bars3Icon,
  HomeIcon,
  XMarkIcon,
  CloudArrowUpIcon,
  CpuChipIcon,
  LightBulbIcon,
  Cog8ToothIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon,
} from '@heroicons/vue/24/outline'

import { i18n } from "@/main.js";
import { onBeforeUnmount, onMounted, ref } from "vue";

const sidebarOpen = ref(false);

const navigation = [
  { name: 'Tilts', icon: HomeIcon, route_name: 'Home'},
  { name: i18n.global.t('sitewide.sidebar_options.configure'), icon: Cog8ToothIcon, route_name: 'TiltBridgeConfig'},
  { name: i18n.global.t('sitewide.sidebar_options.cloud_target'), icon: CloudArrowUpIcon, route_name: 'CloudConfigView', children:[
      { name: 'Fermentrack 2 / Fermentrack.net', route_name: 'FermentrackConfig' },
      { name: i18n.global.t('cloud_config.fermentrack.legacy_fermentrack_menu_item'), route_name: 'LegacyFermentrackConfig' },
      { name: 'Google Sheets', route_name: 'GoogleSheetsConfig' },
      { name: 'Brewers Friend', route_name: 'BrewersFriendConfig' },
      { name: 'Brewfather', route_name: 'BrewfatherConfig' },
      { name: 'Grainfather', route_name: 'GrainfatherConfig' },
      { name: 'Brewstatus', route_name: 'BrewstatusConfig' },
      { name: 'Taplist.io', route_name: 'TaplistIOConfig' },
      { name: 'MQTT', route_name: 'MQTTConfig' },
      { name: i18n.global.t('cloud_config.generic_target.generic_target_menu_item'), route_name: 'GenericTargetConfig' }
    ]},
  // { name: 'Calibration', icon: HomeIcon, route_name: 'Home'},
  { name: 'Help', icon: QuestionMarkCircleIcon, route_name: 'Help'},
  { name: 'About', icon: InformationCircleIcon, route_name: 'About'},
]


</script>



<style scoped>

</style>