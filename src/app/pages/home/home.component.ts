import { Component, computed, effect, inject, Injector, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { Task } from './../../models/task.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

    tasks = signal<Task[]>([]);

    filter = signal<'all' | 'pending' | 'completed'>('all');
    tasksByFilter = computed(() => {
      const filter = this.filter();
      const tasks = this.tasks();
      if(filter === 'pending'){
        return tasks.filter(task => !task.completed)
      }
      if(filter === 'completed'){
        return tasks.filter(task => task.completed)
      }
      return tasks;
    })

    newTaskCtrl = new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
      ]
    });

    injector = inject(Injector);

    ngOnInit() {
      const storage = localStorage.getItem('tasks');
      if (storage){
        const tasks = JSON.parse(storage);
        this.tasks.set(tasks);
      }
      this.trackTasks();
    }

    trackTasks() {
      effect(() => {
        const tasks = this.tasks()
        console.log(tasks);
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }, {injector: this.injector});
    }

    chageHandler() {
      if(this.newTaskCtrl.valid){
        const value = this.newTaskCtrl.value.trim();
        if(value !== ''){
          this.addTaks(value);
          this.newTaskCtrl.setValue('');
        }
      }
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


    updateTask(index: number){
      this.tasks.update((tasks) =>{
        return tasks.map((task, position) =>{
          if(position === index){
            return{
              ...task,
              completed: !task.completed
            }
          }
          return task;
        })
      })
    }

    updateTaskEditingModo(index: number) {
     this.tasks.update(prevState => {
      return prevState.map((task, position) => {
        if (position === index){
          return {
            ...task,
            editing: true 
          }
        }
        return {
          ...task,
          editing: false
        };
      })
     });
    }

    updateTaskText(index: number, event: Event) {
      const input = event.target as HTMLInputElement
      this.tasks.update(prevState => {
       return prevState.map((task, position) => {
         if (position === index){
           return {
             ...task,
             title: input.value,
             editing: false, 
           }
         }
         return task;
       })
      });
     }

     chageFilter(filter: 'all' | 'pending' | 'completed') {
      this.filter.set(filter);
     }
    // completedHandler(event: Event, index: number){
    //   const input = event.target as HTMLInputElement;
    //   const valueChecked = input.checked
      
    //   this.tasks.update((tasks) => {
    //     const updateTasks = [...tasks];
    //     updateTasks[index] = {
    //       ...updateTasks[index],
    //       completed: valueChecked
    //     };
    //     return updateTasks;
    //   })
    // }
}
