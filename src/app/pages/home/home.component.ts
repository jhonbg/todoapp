import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from './../../models/task.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

    tasks = signal<Task[]>([
      {
        id: Date.now(),
        title: 'Crear proyecto',
        completed: false
      },
      {
        id: Date.now(),
        title: 'Crear componente',
        completed: false
      },
    ]);

    chageHandler(event: Event) {
      const input = event.target as HTMLInputElement;
      const newTask = input.value;
      this.addTaks(newTask);
    }

    addTaks(title: string) {
      const newTask = {
        id: Date.now(),
        title,
        completed: false
      };
      this.tasks.update((tasks) => [...tasks, newTask]);
    }

    deleteTask(index: number){
      this.tasks.update((tasks) => tasks.filter((task, position) => position !== index));
    }
}
