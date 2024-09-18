import { describe, test, beforeEach, expect } from 'vitest'
import { mount, config } from '@vue/test-utils'
import LoginView from '@/views/LoginView.vue'
import { runtimeConfiguration } from '@/plugins/runtimeConfiguration'
import { httpPlugin } from '@/plugins/http'
import { setActivePinia, createPinia } from 'pinia'

function init_plugins() {
  config.global.plugins = [
    [
      runtimeConfiguration,
      {
        api_server: 'http://localhost',
        authentication: true
      }
    ],
    httpPlugin
  ]
}

function init_stores() {
    /*
     * Creates a fresh pinia and makes it active so it's automatically picked up
     * by any useStore() call without having to pass it to it: `useStore(pinia)`
     */
    setActivePinia(createPinia())
}

describe('LoginView.vue', () => {
  init_plugins()
  beforeEach(() => init_stores())
  test('should display login form', () => {
    const wrapper = mount(LoginView, {})
    // Check presence of the logo and its source.
    const image = wrapper.get('img')
    expect(image.attributes('src')).toBe('/logo/slurm-web_logo.png')
    // Check presence on user/password inputs.
    wrapper.get('input#user')
    wrapper.get('input#password')
    // Check presence and type of submit button.
    const button = wrapper.get('button')
    expect(button.attributes('type')).toBe('submit')
  })
  test('error on login form submission with empty user input', async () => {
    const wrapper = mount(LoginView, {})
    const button = wrapper.get('button')
    const user_input = wrapper.get('input#user')
    const password_input = wrapper.get('input#password')
    await button.trigger('submit')
    // Check user input is highlighted with red background color while password
    // input is still in gray.
    expect(user_input.classes('bg-red-200')).toBe(true)
    expect(password_input.classes('bg-gray-50')).toBe(true)
  })
  test('error on login form submission with empty password input', async () => {
    const wrapper = mount(LoginView, {})
    const button = wrapper.get('button')
    // Add value in user input.
    const user_input = wrapper.get('input#user')
    user_input.setValue('user')
    const password_input = wrapper.get('input#password')
    await button.trigger('submit')
    // Check password input is highlighted with red background color while user
    // is OK.
    expect(user_input.classes('bg-gray-50')).toBe(true)
    expect(password_input.classes('bg-red-200')).toBe(true)
  })
})
