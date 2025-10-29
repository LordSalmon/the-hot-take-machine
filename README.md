# bun

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.1. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

# Development notes:

## Setup on Raspberry Pi

- Install cups (Common Unix Printing System)

The following notes are only for my specific printer, but it can be abstracted to the own use cases.

- Connect the printer via USB and go to printer settings.
- Check your driver installations. there is often a README somewhere in the driver files that (more or less) properly (try to) explain what the mandatory actions should be.
- Add a printer via USB (not Serial #<1-x> !)
- Check for your Baud size. If there is none, use either 9600 or 115200
- When selecting a driver, use the one ppd script that sounds the most useful. Since my printer is based on esc/pos with a width of 80mm, I chose POS80

- Now you can print via:

```bash
echo "Hello World!" | lp -d POS80
lp -d POS80 your/file/with/printable/content.txt
```
