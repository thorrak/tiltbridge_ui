<template>
  <div class="min-h-full">
    <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <img alt="Logo" src="./assets/logo.svg" class="h-8 w-auto">
            </div>
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                <router-link v-for="item in navigation" :key="item.name" :to="{name: item.route_name}" v-slot="{ href, navigate, isActive }" custom>
                    <a :href="href" :class="[isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'px-3 py-2 rounded-md text-sm font-medium']" :aria-current="isActive ? 'page' : undefined" @click="navigate">{{ item.name }}</a>
                </router-link>
              </div>
            </div>
          </div>

          <div class="-mr-2 flex md:hidden">
            <!-- Mobile menu button -->
            <DisclosureButton class="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span class="sr-only">Open main menu</span>
              <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
              <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      <DisclosurePanel class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <router-link v-for="item in navigation" :key="item.name" :to="{name: item.route_name}" v-slot="{ href, navigate, isActive }" custom>
            <DisclosureButton as="a" :href="href" :class="[isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block px-3 py-2 rounded-md text-base font-medium']" :aria-current="isActive ? 'page' : undefined" @click="navigate">{{ item.name }}</DisclosureButton>
          </router-link>
        </div>

      </DisclosurePanel>
    </Disclosure>

    <router-view></router-view>

  </div>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/20/solid";

const navigation = [
  { name: 'Tilts', route_name: 'Home'},
  { name: 'Configure', route_name: 'TiltBridgeConfig'},
  // { name: 'About', route_name: 'About'},
]

</script>



<style scoped>

</style>