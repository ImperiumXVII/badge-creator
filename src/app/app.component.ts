import { Component } from '@angular/core';
import domToImage from 'dom-to-image';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'badge-creator';
  imagesDir = './assets/';

  selectedImage = '';
  hasSelectedTextImg = false;
  hasSelectedImg = false;

  imgReady = false;

  images = [
    'Chief of Police.png',
    'Assistant Chief.png',
    'Deputy Chief.png',
    'Commander.png',
    'Captain.png',
    'Lieutenant.png',
    'Sergeant.png',
    'Detective.png',
    'Police Officer.png'
  ];

  clickWrapper() {
    const modal = document.getElementById('modal')!;
    const canvas = document.getElementById('canvas');
    if(canvas) {
      canvas.remove();
    }
    modal.style.height = '0';
    modal.style.width = '0';
    const serial = <HTMLInputElement>document.getElementById('serial')!;
    serial.disabled= false;
    serial.focus();
    this.onKeyUp();
  }

  onClick(image: string) {
    const serial = <HTMLInputElement>document.getElementById('serial')!;
    const instructions = document.getElementById('instructions')!;
    if(this.images.indexOf(image) > 3) {
      this.hasSelectedTextImg = true;
      serial.classList.add('visible');
      instructions.innerText = 'Great! Now type your serial number.';
      instructions.style.color = 'green';
    } else {
      this.hasSelectedTextImg = false;
      serial.classList.remove('visible');
      instructions.innerText = 'Oops! That badge doesn\'t support serial numbers.';
      instructions.style.color = 'red';
    }
    this.hasSelectedImg = true;
    this.selectedImage = image;
    serial.focus();
  }

  async onKeyUp(e?: KeyboardEvent) {
    if(!e) {
      e = new KeyboardEvent('');
    }
    const serial = document.getElementById('serial')! as HTMLInputElement;
    const instructions = document.getElementById('instructions')!;
    const exp = new RegExp('^[1-9]{1}[0-9]*$');
    if(!this.hasSelectedTextImg) {
      instructions.innerText = 'Oops! That badge doesn\'t support serial numbers.';
      instructions.style.color = 'red';
      return;
    }
    if(serial.value.length === 0) {
      instructions.innerText = 'Great! Now type your serial number.';
      instructions.style.color = 'green';
      return;
    }
    if(!exp.test(serial.value)) {
      instructions.innerText = 'That\'s not a valid serial number format!';
      instructions.style.color = 'red';
      return;
    }
    if(serial.value.length < 4) {
      instructions.innerHTML = 'Keep going... (' + serial.value.length + '/5)';
      instructions.style.color = 'red';
      return;
    }
    if(serial.value.length > 5) {
      instructions.innerHTML = 'Too many numbers! (' + serial.value.length + '/5)';
      instructions.style.color = 'red';
      return;
    }
    if((serial.value.length === 4 || serial.value.length === 5) && e.key !== 'Enter') {
      instructions.innerHTML = 'Perfect! Press ENTER to download your badge.';
      instructions.style.color = 'green';
      return;
    }
    instructions.innerHTML = 'Rendering...';
    this.download();
  }

  async download() {
    const modal = document.getElementById('modal')!;
    const serial = <HTMLInputElement>document.getElementById('serial')!;
    serial.disabled = true;
    const badge = document.querySelector('#badge');
    const res = await domToImage.toPng(<Node>badge, { bgcolor: 'transparent' });
    let img = new Image();
    img.src = `${res}`;
    img.id = 'canvas';
    img.onload = () => {
      modal.appendChild(img);
      modal.style.height = 'auto';
      modal.style.width = 'auto';
    }
  }
}