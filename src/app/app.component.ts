import {Component, OnInit} from '@angular/core';
import {CdkDragEnd} from "@angular/cdk/drag-drop";

@Component({
  selector: 'agenzzia-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'column-resizer1';

  numberOfColumns = 4;
  widths: number[];
  lefts: number[];
  resetPosition: { x: 0, y: 0 };
  colors = ['tomato', 'deepskyblue', 'beige', 'yellowgreen', 'burlywood', 'lightseagreen'];
  randomColors: string[];

  ngOnInit() {
    const startWidth = 200 / this.numberOfColumns;
    this.widths = this.setArrayOfElements(this.numberOfColumns, startWidth);
    this.lefts = [0, 50];
    this.lefts = this.setArray(this.numberOfColumns, 100 / this.numberOfColumns);
    this.randomColors = this.randomColorArray(this.numberOfColumns);
  }

  dragHandleEnded($event: CdkDragEnd, indexOfDraggedHandler) {
    const handler = $event.source.element.nativeElement as HTMLElement;
    const parentElement = document.querySelector('[data-column-index="' + indexOfDraggedHandler + '"]');
    const parentWidth = (parentElement as HTMLElement).offsetWidth;
    const offsetPx = +this.getTranslate3d(handler)[0].replace('px', '');
    const changedByPercent = offsetPx / parentWidth * 100;
    this.recalculateWidths(changedByPercent, changedByPercent, indexOfDraggedHandler);
    this.recalculateLefts(indexOfDraggedHandler)
    handler.style.transform = 'translate3d(0,0,0)';
  }

  setArray(count: number, progression: number) {
    return Array(count).fill(0).map((x, i) => progression * i)
  }

  setArrayOfElements(count: number, element: any) {
    return Array(count).fill(0).map((x) => element)
  }

  setShortenedArrayByLastElement(count: number, progression) {
    return this.setArray(count - 1, progression);
  }

  private recalculateWidths(percentualChangeOfWidth: number, offsetPercents: number, indexOfSourceColumn) {
    const remainingWidth = 200 / this.numberOfColumns;
    const newWidths = [this.widths[indexOfSourceColumn] + this.widths[indexOfSourceColumn] * percentualChangeOfWidth / 100 * 2
    ];
    this.widths[indexOfSourceColumn] = newWidths[0];
    this.widths[indexOfSourceColumn + 1] = 200 - newWidths[0] - (this.numberOfColumns - 2) * remainingWidth;
    console.log(this.widths);
    console.log(this.widths.reduce((sum,item) => {
      return sum += item
    },0));

    this.resetPosition = {x: 0, y: 0}
  }

  private recalculateLefts(indexOfSourceColumn) {
    let sum = 0;
    for (let i = 0; i < this.numberOfColumns; ++i) {
      this.lefts[i] = sum;
      sum += this.widths[i] / 2;
    }
    // console.log(this.lefts);
    // this.lefts[indexOfSourceColumn + 1] = this.widths[indexOfSourceColumn] / 2 + this.lefts[indexOfSourceColumn];
  }

  private getTranslate3d(el) {
    const values = el.style.transform.split(/\w+\(|\);?/);
    if (!values[1] || !values[1].length) {
      return [];
    }
    return values[1].split(/,\s?/g);
  }

  randomColorArray(numOfElements: number) {
    let randomColors = [...this.colors];
    return this.shuffleArray(this.colors.length).map((index) => {
      return randomColors[index];
    })
  }

  private shuffleArray(arrayLength) {
    let resultArray = this.setArray(arrayLength, 1);
    for (let i = resultArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i)
      const temp = resultArray[i]
      resultArray[i] = resultArray[j]
      resultArray[j] = temp
    }
    return resultArray;
  }
}
