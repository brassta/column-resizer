import {Component, OnInit} from '@angular/core';
import {CdkDragEnd} from '@angular/cdk/drag-drop';

/**
 na pocetku imas 4 kolone siroke po 25%
 na pocetku imas 4 kolone siroke po 125px;
 ------------------------------------------------
 offset px je tacan uvek
 u principu zanimaju te samo dve kolone, pre i posle handlera
 ako nadjes koliko su siroke te dve kolone zajedno to je nekih 100% izmena
 prva kolona je prva kolona + offset
 druga kolona je druga kolona - offset
 zbir prve i druge kolone trebalo bi da ostane isti
 ostale te ne zanimaju
 osvezi nizove sa sirinama kolona
 */

@Component({
  selector: 'agenzzia-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'column-resizer1';

  numberOfColumns = 4;
  tableWidth = 0;
  widths: number[];
  widthsPx: number[];
  minWidth = 30;
  lefts: number[];
  leftsPx: number[];
  offsetsPx: number[];
  resetPosition: { x: 0, y: 0 };
  colors = ['tomato', 'deepskyblue', 'beige', 'yellowgreen', 'burlywood', 'lightseagreen'];
  randomColors: string[];

  ngOnInit() {
    this.tableWidth = (document.querySelector('.columns') as HTMLElement).offsetWidth;
    const startWidth = 200 / this.numberOfColumns;
    this.widths = this.setArrayOfElements(this.numberOfColumns, startWidth);
    this.widthsPx = this.setArrayOfElements(this.numberOfColumns, this.tableWidth / this.numberOfColumns);
    this.offsetsPx = this.setArrayOfElements(this.numberOfColumns - 1, 0);
    console.log(this.widths, this.widthsPx);
    this.lefts = this.setArray(this.numberOfColumns, 100 / this.numberOfColumns);
    this.leftsPx = this.setArray(this.numberOfColumns, this.tableWidth / this.numberOfColumns);
    console.log(this.lefts);
    console.log(this.leftsPx);
    console.log(this.offsetsPx);
    this.randomColors = this.randomColorArray(this.numberOfColumns);

  }

  dragHandleEnded($event: CdkDragEnd, indexOfDraggedHandler) {
    const handler = $event.source.element.nativeElement as HTMLElement;
    const parentElement = document.querySelector('[data-column-index="' + indexOfDraggedHandler + '"]');
    const parentWidth = (parentElement as HTMLElement).offsetWidth;
    // console.log('parent', parentWidth, parentElement);
    const offsetPx = +this.getTranslate3d(handler)[0].replace('px', '');
    // console.log('offsetPx', offsetPx);
    // console.log('remaining px', parentWidth / 2 + offsetPx);

    const changedByPercent = offsetPx / parentWidth * 100;
    // console.log('percentage', changedByPercent);
    this.recalculateWidths(offsetPx, indexOfDraggedHandler);
    // this.recalculateLefts(indexOfDraggedHandler);
    handler.style.transform = 'translate3d(0,0,0)';
  }

  setArray(count: number, progression: number) {
    return Array(count).fill(0).map((x, i) => progression * i);
  }

  setArrayOfElements(count: number, element: any) {
    return Array(count).fill(0).map((x) => element);
  }

  setShortenedArrayByLastElement(count: number, progression) {
    return this.setArray(count - 1, progression);
  }

  private recalculateWidths(offsetX: number, indexOfDraggedHandler: any) {
    // console.log('widths', JSON.stringify(this.widthsPx));
    console.log('offset', offsetX);
    console.log('index', indexOfDraggedHandler);
    const localOffset = this.offsetsPx[indexOfDraggedHandler] - offsetX;
    this.offsetsPx[indexOfDraggedHandler] = offsetX;
    console.log('localOfset', -localOffset);
    console.log('@@@@@@@@@@ offsets', this.offsetsPx);
    this.widthsPx[indexOfDraggedHandler] = this.widthsPx[indexOfDraggedHandler] - localOffset;
    this.widthsPx[indexOfDraggedHandler + 1] = this.widthsPx[indexOfDraggedHandler + 1] + localOffset;
    console.log('posle widths', this.widthsPx);
    console.log('---------------------------------------');
    const testWidths = this.widthsPx.map((item) => {
      return item / this.tableWidth * 100 * 2
    })
    console.log('test widths', testWidths);
    const testLefts = this.recalculateLefts(testWidths);
    console.log(testLefts);
    this.redraw(testWidths, testLefts)

  }


  private recalculateLefts(widths: number[]) {
    let sum = 0;
    let internalLefts = this.setArray(this.numberOfColumns, 0);
    console.log(internalLefts);
    for (let i = 0; i < this.numberOfColumns; ++i) {
      internalLefts[i] = sum;
      sum += widths[i] / 2;
    }
    return internalLefts;
  }

  private getTranslate3d(el) {
    const values = el.style.transform.split(/\w+\(|\);?/);
    if (!values[1] || !values[1].length) {
      return [];
    }
    return values[1].split(/,\s?/g);
  }

  randomColorArray(numOfElements: number) {
    const randomColors = [...this.colors];
    return this.shuffleArray(this.colors.length).map((index) => {
      return randomColors[index];
    });
  }

  private shuffleArray(arrayLength) {
    const resultArray = this.setArray(arrayLength, 1);
    for (let i = resultArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = resultArray[i];
      resultArray[i] = resultArray[j];
      resultArray[j] = temp;
    }
    return resultArray;
  }


  private redraw(newWidths: number[], newLefts: number[]) {
    this.widths = [...newWidths];
    this.lefts = [...newLefts];
    this.offsetsPx = this.setArrayOfElements(this.numberOfColumns - 1, 0);
    this.resetPosition = {x: 0, y: 0}
  }
}
