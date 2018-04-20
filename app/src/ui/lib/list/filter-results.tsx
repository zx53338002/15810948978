import * as React from 'react'

import { List, findNextSelectableRow, SelectionSource } from '../../lib/list'

interface IFilterResultProps {
  readonly rowCount: number
  readonly selectedRows: ReadonlyArray<number>
  readonly renderRow: (index: number) => JSX.Element | null
  readonly renderNoItems?: () => JSX.Element | null

  /** The height of the rows. */
  readonly rowHeight: number

  /** Any props which should cause a re-render if they change. */
  readonly invalidationProps: any

  readonly onSelectedRowChanged?: (
    index: number,
    source: SelectionSource
  ) => void

  readonly canSelectRow: (index: number) => boolean

  readonly onFocusTextBox: (event: React.KeyboardEvent<any>) => void
}

export class FilterResults extends React.Component<IFilterResultProps, {}> {
  private list: List | null = null

  public render() {
    if (this.props.rowCount === 0 && this.props.renderNoItems) {
      return this.props.renderNoItems()
    } else {
      return (
        <List
          ref={this.onListRef}
          rowCount={this.props.rowCount}
          rowRenderer={this.props.renderRow}
          rowHeight={this.props.rowHeight}
          selectedRows={this.props.selectedRows}
          onSelectedRowChanged={this.props.onSelectedRowChanged}
          onRowClick={this.onRowClick}
          onRowKeyDown={this.onRowKeyDown}
          canSelectRow={this.props.canSelectRow}
          invalidationProps={{
            ...this.props,
            ...this.props.invalidationProps,
          }}
        />
      )
    }
  }

  private onListRef = (instance: List | null) => {
    this.list = instance
  }

  public focus() {
    if (this.list != null) {
      this.list.focus()
    }
  }

  private onRowClick = (row: number, source: SelectionSource) => {
    if (this.props.onSelectedRowChanged) {
      this.props.onSelectedRowChanged(row, source)
    }
  }

  private onRowKeyDown = (row: number, event: React.KeyboardEvent<any>) => {
    const list = this.list
    if (!list) {
      return
    }

    const rowCount = this.props.rowCount

    const firstSelectableRow = findNextSelectableRow(
      rowCount,
      { direction: 'down', row: -1 },
      this.props.canSelectRow
    )
    const lastSelectableRow = findNextSelectableRow(
      rowCount,
      { direction: 'up', row: 0 },
      this.props.canSelectRow
    )

    let shouldFocus = false

    if (event.key === 'ArrowUp' && row === firstSelectableRow) {
      shouldFocus = true
    } else if (event.key === 'ArrowDown' && row === lastSelectableRow) {
      shouldFocus = true
    }

    if (shouldFocus) {
      this.props.onFocusTextBox(event)
    }
  }
}
