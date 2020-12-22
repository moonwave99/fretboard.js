import { modes as defaultModes, notesWithAccidentals } from '../config.js';

export default function Form({
  prefix,
  el,
  onChange,
  boxes = [],
  modes = defaultModes,
  defaultState = {
    root: 'C',
    mode: 'ionian',
  },
}) {
  let state = {
    ...defaultState,
    box: boxes[0],
  };
  el.innerHTML = `
    <form>
        <div class="field">
            <label for="${prefix}-root" class="label">Root Note</label>
		    <div class="control">
		        <div class="select is-small">
                    <select name="root" id="${prefix}-root">
                    ${notesWithAccidentals
                      .map(
                        (x) =>
                          `<option value="${x}" ${
                            x === defaultState.root && 'selected'
                          }>${x}</option>`
                      )
                      .join('\n')}
                    </select>
                </div>
            </div>
        </div>
        <div class="field">
            <label for="${prefix}-mode" class="label">Mode</label>
		        <div class="control">
		          <div class="select is-small">
                <select name="mode" id="${prefix}-mode">
                ${modes
                  .map(
                    (x) =>
                      `<option value="${x}" ${
                        x === defaultState.mode && 'selected'
                      }>${x}</option>`
                  )
                  .join('\n')}
                </select>
            </div>
          </div>
        </div>        
        <div class="field">
          <label class="label">Box</label>
		        <div class="control">
            ${boxes
              .map(
                (x, i) => `
            <input id="${prefix}-${x}" value="${x}" name="box" type="radio" ${
                  i === 0 && 'checked'
                }>
            <label for="${prefix}-${x}">${x}</label>
            `
              )
              .join('\n')}
        </div>
    </form>
    `;

  el.querySelectorAll('select, input').forEach((select) =>
    select.addEventListener('change', (event) => {
      state = {
        ...state,
        [event.currentTarget.name]: event.currentTarget.value,
      };
      onChange(state);
    })
  );
}