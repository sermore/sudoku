import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ReadonlyCell} from '../cell';
import {BoardService} from '../board.service';
import {HelperService} from '../helper.service';
import {SettingsService} from '../settings.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit, OnDestroy {

  @Input() cell: ReadonlyCell;
  hints: Array<number>;
  private subscription: Subscription;

  constructor(private boardService: BoardService, private helper: HelperService, private settings: SettingsService) {
  }

  ngOnInit() {
    this.subscription = this.boardService.getCell(this.cell).subscribe((c) => {
      // console.log(`${this.cell}: observe change ${c}`);
      this.calcHints();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private calcHints() {
    // console.log(`calc hints ${this.cell}`);
    this.hints = new Array<number>(this.boardService.boardSize);
    const source = this.settings.manualHints ? this.cell.manualHints : this.cell.hints;
    source.forEach(h => this.hints[h - 1] = h);
  }

  get invalid(): boolean {
    return !this.cell.valid;
  }

  get modifiable(): boolean {
    return this.cell.modifiable;
  }

  get selected(): boolean {
    const sel = this.boardService.selected;
    return sel && sel === this.cell;
  }

  get highlighted(): boolean {
    return this.boardService.highlighted.has(this.cell) && !this.sameNumber;
  }

  get sameNumber(): boolean {
    return this.boardService.selected && !this.boardService.selected.isEmpty() && this.cell !== this.boardService.selected &&
      this.cell.num === this.boardService.selected.num;
  }

  get number(): number {
    return this.cell.num;
  }

  hintHighlighted(num: number): boolean {
    return this.boardService.selected && num === this.boardService.selected.num;
  }

  selectCell(cell: ReadonlyCell) {
    this.boardService.selected = cell;
  }

}
