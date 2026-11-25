const PHONE = '+18257365665';
const EMAIL = 'info@fatehprinting.com';

const art = document.getElementById('art');
const print = document.getElementById('print');
const textInput = document.getElementById('text');
const form = document.getElementById('form');
const status = document.getElementById('status');
const checked = (name) => document.querySelector(`input[name="${name}"]:checked`);

// Where the text sits on each product, and how wide it can be.
const PLACEMENT = {
  'T-shirt': { x: 150, y: 150, width: 120 },
  Hoodie: { x: 150, y: 185, width: 110 },
  Mug: { x: 140, y: 170, width: 120 },
  Hat: { x: 150, y: 155, width: 115 },
};

function draw() {
  const item = checked('item').value;
  const colour = checked('colour');
  art.querySelectorAll('[data-for]').forEach((g) => g.toggleAttribute('hidden', g.dataset.for !== item));
  art.style.setProperty('--item', colour.dataset.hex);

  const { x, y, width } = PLACEMENT[item];
  print.textContent = textInput.value;
  print.setAttribute('x', x);
  print.setAttribute('y', y);
  print.setAttribute('fill', colour.dataset.ink);
  // Shrink long text until it fits on the product.
  let size = 32;
  print.setAttribute('font-size', size);
  while (size > 10 && print.getComputedTextLength() > width) {
    print.setAttribute('font-size', --size);
  }
  art.setAttribute('aria-label', `${colour.value} ${item} preview with the text ${textInput.value}`);
}

document.querySelectorAll('input[name="item"], input[name="colour"]').forEach((el) => el.addEventListener('change', draw));
textInput.addEventListener('input', draw);
document.fonts.ready.then(draw);
draw();

document.querySelectorAll('[data-product]').forEach((link) =>
  link.addEventListener('click', () => { form.product.value = link.dataset.product; }));

document.getElementById('use').addEventListener('click', () => {
  const item = checked('item').value;
  form.product.value = item === 'Mug' ? 'Mugs & gifts' : 'Apparel';
  const idea = `${checked('colour').value} ${item} with the text "${textInput.value}".`;
  form.details.value = form.details.value ? `${form.details.value}\n${idea}` : idea;
  document.getElementById('quote').scrollIntoView();
  form.elements.name.focus({ preventScroll: true });
});

function message() {
  const data = new FormData(form);
  return [
    'Hi Fateh Printing, I would like a quote.',
    `Name: ${data.get('name')}`,
    `Product: ${data.get('product')}`,
    data.get('qty') && `Quantity: ${data.get('qty')}`,
    `Details: ${data.get('details')}`,
  ].filter(Boolean).join('\n');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const body = encodeURIComponent(message());
  const byText = event.submitter?.value === 'sms';
  window.location.href = byText
    ? `sms:${PHONE}?&body=${body}`
    : `mailto:${EMAIL}?subject=${encodeURIComponent('Quote request')}&body=${body}`;
  status.textContent = `Your ${byText ? 'text' : 'email'} app should open. Press send there to reach us. If nothing opens, use Copy message.`;
});

document.getElementById('copy').addEventListener('click', async () => {
  if (!form.reportValidity()) return;
  try {
    await navigator.clipboard.writeText(message());
    status.textContent = `Copied. Paste it into a text, email or Instagram message.`;
  } catch {
    status.textContent = `Copying didn't work. Call or text 825-736-5665 instead.`;
  }
});

document.getElementById('year').textContent = new Date().getFullYear();
