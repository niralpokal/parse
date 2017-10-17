import { Component } from '@angular/core';

@Component({
    selector: 'statement-grid',
    template:`
    <div class="grid"> 
        <div class="grid-row">
            <p *ngFor="let header of headings" class="grid-cell"> {{header}} </p>
        </div>
        <div *ngFor="let item of gridItems" class="grid-row">
            <div class="grid-cell">{{item.date}}</div>
            <div class="grid-cell">{{item.location}}</div>
            <div class="grid-cell">{{item.amount}}</div>
        </div>
    </div>
    `,
    styleUrls:['statement-grid.component.scss']
})

export class StatementGridComponent {
    headings = ['Date', 'Location', 'Amount']
    gridItems = [{
        date: '01/22',
        location: 'NY',
        amount: '107.23'
    },
    {
        date: '01/22',
        location: 'NY',
        amount: '107.23'
    },
    {
        date: '01/22',
        location: 'NY',
        amount: '107.23'
    }]
}