/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, es6 */

'use strict';

const applicationServerPublicKey = 'BHs1mMaG9o9H7hqw3CK-9Q4Mwfkg8DNcv2snnl_OTZjxU28BIvqHUgT1NYcZNWmDcQhGEW8Xx2BIJI4bPILWNBk';

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function initialisePush() {

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

  });

}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('User is subscribed.');

    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
  });
}

function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server
  if (subscription) {
   localStorage.subscription = JSON.stringify(subscription);
  } 
}

if ('serviceWorker' in navigator) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('service-worker.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    if ('PushManager' in window) {
      swRegistration = swReg;
      subscribeUser();
      initialisePush();
    } else {
      console.warn('Push messaging is not supported');
    }
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} 