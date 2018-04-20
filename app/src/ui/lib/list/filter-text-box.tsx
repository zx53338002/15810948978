import * as React from 'react'

import { TextBox } from '../../lib/text-box'

import { SelectionDirection } from '../../lib/list'

interface IFilterTextBoxProps {
  /** The number of rows in the current filtered list */
  readonly rowCount: number

  /** The current filter text to use in the form */
  readonly filterText?: string

  /** Called when the filter text is changed by the user */
  readonly onFilterTextChanged?: (text: string) => void

  /**
   * Called when a key down happens in the filter text input. Users have a
   * chance to respond or cancel the default behavior by calling
   * `preventDefault()`.
   */
  readonly onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void

  /**
   * Whether or not the filter list should allow selection
   * and filtering. Defaults to false.
   */
  readonly disabled?: boolean

  /** Called when an item should be focused in the filtered list. */
  readonly onMoveToRow: (
    direction: SelectionDirection,
    currentRow: number
  ) => void

  /** Called when the parent component should choose the default entry in the filtered list. */
  readonly onSelectFirstRow: () => void
}

/** A List which includes the ability to filter based on its contents. */
export class FilterTextBox extends React.Component<IFilterTextBoxProps, {}> {
  private textBoxRef: TextBox | null = null

  public render() {
    return (
      <TextBox
        ref={this.onTextBoxRef}
        type="search"
        autoFocus={true}
        placeholder="Filter"
        className="filter-list-filter-field"
        onValueChanged={this.onFilterValueChanged}
        onKeyDown={this.onKeyDown}
        value={this.props.filterText}
        disabled={this.props.disabled}
      />
    )
  }

  public focus() {
    if (this.textBoxRef != null) {
      this.textBoxRef.focus()
    }
  }

  public selectAll() {
    if (this.textBoxRef != null) {
      this.textBoxRef.selectAll()
    }
  }

  private onTextBoxRef = (textBox: TextBox | null) => {
    this.textBoxRef = textBox
  }

  private onFilterValueChanged = (text: string) => {
    if (this.props.onFilterTextChanged) {
      this.props.onFilterTextChanged(text)
    }
  }

  private onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const key = event.key

    if (this.props.onKeyDown) {
      this.props.onKeyDown(event)
    }

    if (event.defaultPrevented) {
      return
    }

    const rowCount = this.props.rowCount

    if (key === 'ArrowDown') {
      if (rowCount > 0) {
        this.props.onMoveToRow('down', -1)
      }

      event.preventDefault()
    } else if (key === 'ArrowUp') {
      if (rowCount > 0) {
        this.props.onMoveToRow('up', 0)
      }

      event.preventDefault()
    } else if (key === 'Enter') {
      // no repositories currently displayed, bail out
      if (rowCount === 0) {
        return event.preventDefault()
      }

      const filterText = this.props.filterText

      if (filterText !== undefined && !/\S/.test(filterText)) {
        return event.preventDefault()
      }

      if (this.props.onSelectFirstRow) {
        this.props.onSelectFirstRow()
      }
    }
  }
}
