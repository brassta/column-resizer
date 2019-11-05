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
  widths: number[];
  widthsPx: number[];
  minWidth = 30;
  lefts: number[];
  resetPosition: { x: 0, y: 0 };
  colors = ['tomato', 'deepskyblue', 'beige', 'yellowgreen', 'burlywood', 'lightseagreen'];
  randomColors: string[];

  ngOnInit() {
    const startWidth = 100 / this.numberOfColumns;
    this.widths = this.setArrayOfElements(this.numberOfColumns, startWidth);
    this.widthsPx = this.setArrayOfElements(this.numberOfColumns, 125);
    this.lefts = this.setArray(this.numberOfColumns, 100 / this.numberOfColumns);
    this.randomColors = this.randomColorArray(this.numberOfColumns);
  }

  dragHandleEnded($event: CdkDragEnd, indexOfDraggedHandler) {
    const handler = $event.source.element.nativeElement as HTMLElement;
    const parentElement = document.querySelector('[data-column-index="' + indexOfDraggedHandler + '"]');
    const parentWidth = (parentElement as HTMLElement).offsetWidth;
    console.log('parent', parentWidth, parentElement);
    const offsetPx = +this.getTranslate3d(handler)[0].replace('px', '');
    console.log('offsetPx', offsetPx);
    console.log('remaining px', parentWidth / 2 + offsetPx);

    const changedByPercent = offsetPx / parentWidth * 100;
    console.log('percentage', changedByPercent);
    // this.recalculateWidths(changedByPercent, indexOfDraggedHandler);
    this.recalculateWidths2(parentWidth / 2 + offsetPx, indexOfDraggedHandler);
    this.recalculateLefts(indexOfDraggedHandler);
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

  private recalculateWidths2(actualWidthOfColumnAfterDrag: number, indexOfDraggedHandler: any) {
    console.log(this.widthsPx);
    const newWidthsPx = this.widthsPx.map((item, i) => {
      console.log(item);
      if (i === indexOfDraggedHandler) {
        return actualWidthOfColumnAfterDrag;
      } else if (i === indexOfDraggedHandler + 1) {
        return (item * 2 - actualWidthOfColumnAfterDrag);
      } else {
        return item;
      }
    });

    this.widthsPx = [...newWidthsPx];

    this.widths = newWidthsPx.map(item => {
      return item / 500 * 100 * 2;
    });
    console.log('finale', this.widths);
    this.resetPosition = {x: 0, y: 0};
  }

  private recalculateWidths(percentualChangeOfWidth: number, indexOfSourceColumn) {
    return;
    const minWidth = this.minWidth / 50 * 100;
    // console.log('minimalno', minWidth);
    const remainingWidth = 200 / this.numberOfColumns;
    let newnewWidths = this.widths.map((item, i) => {
      if (i === indexOfSourceColumn) {
        return item + percentualChangeOfWidth;
      } else if (i === indexOfSourceColumn + 1) {
        return item - percentualChangeOfWidth;
      } else {
        return item;
      }
    });
    this.widths = [...newnewWidths];
    newnewWidths = [];
    // console.log('posle', this.widths);
    // console.log('total', this.widths.reduce((sum, item) => {
    //   return sum += item;
    // }, 0));

    this.resetPosition = {x: 0, y: 0};
  }

  private recalculateLefts(indexOfSourceColumn) {
    let sum = 0;
    for (let i = 0; i < this.numberOfColumns; ++i) {
      this.lefts[i] = sum;
      sum += this.widths[i] / 2;
    }
    console.log('lefts', this.lefts);
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


}
