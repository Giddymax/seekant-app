type ServiceContent = {
  headline: string
  paragraphs: string[]
  includes: string[]
  idealFor: string[]
  prepare: string[]
  turnaround: string
}

type ServiceLike = {
  name: string
  slug: string
  category: string
  description: string | null
}

const DEFAULT_CONTENT: Record<string, ServiceContent> = {
  Print: {
    headline: 'Sharp print work for everyday business needs.',
    paragraphs: [
      'This service is prepared with attention to clarity, colour, alignment, and finish so your printed materials look professional from the first copy to the last.',
      'Bring your file ready to print, or let our team help with layout, resizing, and file checks before production begins.',
    ],
    includes: ['File checking and print setup', 'Clear black-and-white or full-colour output', 'Finishing guidance based on use'],
    idealFor: ['Businesses and offices', 'Schools and churches', 'Events, forms, and everyday documents'],
    prepare: ['Print-ready file or original document for this job', 'Exact quantity, page size, and single or double-sided choice', 'Paper type, colour preference, and finishing needed'],
    turnaround: 'Many standard print jobs are ready the same day once the file, paper choice, and quantity are confirmed.',
  },
  Signage: {
    headline: 'Visible branding for shops, events, vehicles, and outdoor spaces.',
    paragraphs: [
      'We produce signage that is easy to read, strong enough for its setting, and matched to your brand colours and message.',
      'From small directional signs to large promotional displays, we help you choose sizes, materials, and finishing that suit the location.',
    ],
    includes: ['Artwork sizing for large formats', 'Indoor and outdoor material guidance', 'Durable finishing for display use'],
    idealFor: ['Retail shops and offices', 'Events and exhibitions', 'Outdoor advertising'],
    prepare: ['Logo, wording, and any photos for the sign or banner', 'Exact display dimensions and viewing location', 'Indoor or outdoor use, fixing method, and deadline'],
    turnaround: 'Production timing depends on the sign size, material, weatherproof finishing, and whether installation is required.',
  },
  Apparel: {
    headline: 'Custom apparel that carries your identity clearly.',
    paragraphs: [
      'We help teams, schools, churches, businesses, and groups create wearable branded items with clean placement and strong visual impact.',
      'Whether you need names, numbers, logos, or full artwork, we guide the print method and material choice for the best result.',
    ],
    includes: ['Artwork placement guidance', 'Name, number, and logo printing options', 'Bulk order support'],
    idealFor: ['Teams and schools', 'Corporate uniforms', 'Events and group wear'],
    prepare: ['Garment type, sizes, colours, and quantity per size', 'Logo, names, numbers, or artwork for placement', 'Preferred print or embroidery position on each item'],
    turnaround: 'Apparel timing depends on garment availability, size breakdown, artwork setup, and the number of customized pieces.',
  },
  Design: {
    headline: 'Design support that makes your documents and brand look polished.',
    paragraphs: [
      'This service helps turn rough information, ideas, or files into clean, readable, and professional work ready for use or print.',
      'We focus on layout, hierarchy, consistency, and presentation so the final result communicates clearly.',
    ],
    includes: ['Layout and formatting support', 'Typography and spacing cleanup', 'Print-ready or digital file preparation'],
    idealFor: ['Business documents', 'Brand and marketing materials', 'Personal applications and presentations'],
    prepare: ['Text, photos, logos, and contact details to include', 'Finished dimensions, platform, or print format', 'Reference style, brand colours, and deadline'],
    turnaround: 'Simple layout edits can be quick, while full designs depend on content readiness, revisions, and output format.',
  },
  Publishing: {
    headline: 'Organized print and finishing for books, programmes, and publications.',
    paragraphs: [
      'We prepare multi-page work with attention to page order, readability, binding, and the finishing details that make publications feel complete.',
      'From church programmes to books and institutional materials, we help make your content presentable and easy to handle.',
    ],
    includes: ['Page setup and ordering', 'Cover and interior print support', 'Binding or finishing guidance'],
    idealFor: ['Books and reports', 'Church and event programmes', 'School and institutional materials'],
    prepare: ['Final manuscript, programme, or report file', 'Page count, copy quantity, and finished size', 'Cover, binding, and paper preferences'],
    turnaround: 'Publishing work depends on page count, cover setup, copy quantity, and the chosen binding or finishing method.',
  },
  Embroidery: {
    headline: 'Textured, long-lasting branding for garments and accessories.',
    paragraphs: [
      'Embroidery gives logos and names a premium finish that lasts well on uniforms, caps, shirts, bags, and other fabric items.',
      'We review your artwork and advise on thread colours, placement, and size so the stitched result stays clean and readable.',
    ],
    includes: ['Logo setup for stitching', 'Thread colour guidance', 'Placement and sizing advice'],
    idealFor: ['Uniforms and polos', 'Caps and bags', 'Corporate and school branding'],
    prepare: ['Logo or wording for stitching', 'Fabric item type, quantity, and thread colours', 'Embroidery placement and approximate stitch size'],
    turnaround: 'Embroidery timing depends on logo digitizing, stitch density, thread colours, and the number of items.',
  },
  Gifts: {
    headline: 'Personalized items for memorable gifts and brand promotion.',
    paragraphs: [
      'We create customized gift and souvenir items that carry names, photos, messages, or branding in a neat and presentable way.',
      'These items are useful for events, appreciation packages, promotions, and personal celebrations.',
    ],
    includes: ['Artwork placement support', 'Personalization with names or messages', 'Gift and promotional item guidance'],
    idealFor: ['Corporate gifts', 'Events and celebrations', 'Promotional campaigns'],
    prepare: ['Gift or souvenir item type', 'Names, photos, logos, or messages for personalization', 'Quantity, packaging preference, and event date'],
    turnaround: 'Gift production depends on item stock, personalization method, artwork approval, and quantity.',
  },
}

const SERVICE_CONTENT: Record<string, ServiceContent> = {
  photocopying: {
    headline: 'Fast document copies that stay clean, readable, and consistent.',
    paragraphs: [
      'Our photocopying service is built for students, offices, churches, schools, and individuals who need dependable copies without fuss. We keep text sharp, images clear, and pages properly aligned so the finished set is easy to read and distribute.',
      'Whether you need a few pages copied quickly or a larger batch for meetings, classes, training, or forms, we help you choose black-and-white or colour output, single or double-sided copies, and the right paper size.',
    ],
    includes: ['Black-and-white and colour copies', 'Single-sided or double-sided output', 'Sorting and basic document handling'],
    idealFor: ['Office documents', 'School notes and handouts', 'Church and event materials'],
    prepare: ['Original hardcopy or digital document to copy', 'Number of copies for each page or set', 'Black-and-white or colour, paper size, and single or double-sided choice'],
    turnaround: 'Small photocopy sets are usually handled while you wait; sorted, double-sided, or bulk sets need extra production time.',
  },
  lamination: {
    headline: 'Protect important prints with a clean, durable finish.',
    paragraphs: [
      'Lamination helps preserve certificates, ID sheets, cards, notices, menus, photos, and frequently handled documents. It adds a protective layer that resists dirt, moisture, and daily wear while giving the piece a neat finish.',
      'We check the document size and recommend a suitable lamination finish so the final item is sealed properly and ready for long-term use.',
    ],
    includes: ['Document protection', 'Glossy sealed finish', 'Size trimming after lamination'],
    idealFor: ['Certificates and cards', 'Menus and notices', 'Photos and keepsakes'],
    prepare: ['Document, card, certificate, photo, menu, or notice to laminate', 'Finished size and whether you want a clear border left around it', 'Number of pieces and whether any items need copying or printing first'],
    turnaround: 'Standard ID-card, A4, certificate, and menu lamination is usually quick after the piece is ready; larger or mixed-size batches take longer.',
  },
  'spiral-binding': {
    headline: 'Neatly bound documents that are easy to read and present.',
    paragraphs: [
      'Spiral binding is a practical finish for reports, manuals, proposals, coursework, notebooks, and training documents. It keeps pages together securely while allowing the document to open flat for easy reading.',
      'We help arrange the page order, add front and back covers where needed, and finish the document so it feels organized and professional.',
    ],
    includes: ['Page ordering checks', 'Front and back cover options', 'Durable spiral binding'],
    idealFor: ['Reports and manuals', 'School projects', 'Training and workshop documents'],
    prepare: ['Pages arranged in final reading order or a print-ready PDF', 'Total page count and number of bound copies', 'Front cover, back cover, and spiral colour preference'],
    turnaround: 'Most single-document spiral binding can be finished the same day after printing; multiple books or thick manuals need more time.',
  },
  'id-card-printing': {
    headline: 'Professional ID cards for teams, schools, and organizations.',
    paragraphs: [
      'We design and print ID cards that look official, readable, and durable. Each card can include names, roles, photos, logos, identification numbers, and other details your organization needs.',
      'The layout is prepared for clarity, with careful spacing for photos and text so the cards are easy to verify at a glance.',
    ],
    includes: ['Card layout and photo placement', 'Logo and role details', 'Lamination or protective finishing options'],
    idealFor: ['Schools and churches', 'Businesses and staff teams', 'Events and membership groups'],
    prepare: ['Names, roles, ID numbers, and any department details', 'Clear passport-style photos for each card holder', 'Organization logo, card layout preference, and quantity'],
    turnaround: 'Small ID card batches can be quick when photos and names are ready; staff lists, design changes, and lamination add time.',
  },
  'business-cards': {
    headline: 'Business cards that make your first impression feel intentional.',
    paragraphs: [
      'A well-designed business card gives people a simple, memorable way to keep your contact details. We create cards that balance your name, role, brand, phone number, location, and social handles without looking crowded.',
      'You can print from an existing design or ask us to prepare a fresh layout that matches your brand style.',
    ],
    includes: ['Single or double-sided layouts', 'Matte or gloss finish guidance', 'Print-ready design support'],
    idealFor: ['Entrepreneurs and startups', 'Corporate teams', 'Service providers and creatives'],
    prepare: ['Business name, person name, role, phone, address, and social handles', 'Logo, brand colours, and any card design reference', 'Card quantity, size, and matte, gloss, or plain finish preference'],
    turnaround: 'Business cards move quickly once the layout is approved; special finishes or larger quantities need extra production time.',
  },
  letterheads: {
    headline: 'Branded letterheads for professional communication.',
    paragraphs: [
      'Letterheads make invoices, letters, proposals, official notices, and internal documents feel consistent and trustworthy. We design and print layouts that keep your brand visible while leaving enough space for clear writing.',
      'Your letterhead can include your logo, contact details, address, registration information, and subtle brand elements.',
    ],
    includes: ['Clean branded layout', 'Print-ready document setup', 'Bulk office printing options'],
    idealFor: ['Business letters', 'Invoices and quotations', 'Official documents'],
    prepare: ['Logo, business name, address, phone, email, and registration details', 'Preferred letterhead size and paper type', 'Quantity and whether you need a digital editable version'],
    turnaround: 'Letterhead timing depends on how quickly the layout is approved and the number of printed sheets required.',
  },
  'roll-up-banners': {
    headline: 'Portable banners for strong event and shop visibility.',
    paragraphs: [
      'Roll-up banners are easy to transport, quick to set up, and excellent for promoting products, services, campaigns, and events. We prepare artwork at the correct size so text stays readable from a distance.',
      'The design can include your logo, headline, photos, service list, contact details, and a clear call to action.',
    ],
    includes: ['Large-format artwork setup', 'Print and stand preparation', 'Readable layout guidance'],
    idealFor: ['Exhibitions and fairs', 'Church and school events', 'Shop and office displays'],
    prepare: ['Logo, headline, service list, contact details, and call to action', 'Roll-up stand size or preferred banner dimensions', 'High-resolution photos and any brand colours to match'],
    turnaround: 'Roll-up banners are usually produced within a few days after artwork approval and stand size confirmation.',
  },
  'banners-signages': {
    headline: 'Banners and signs that make your message easy to notice.',
    paragraphs: [
      'We create banners and signage for promotions, directions, events, shopfronts, announcements, and brand visibility. The design is planned around viewing distance, placement, and the message you need people to remember.',
      'From indoor banners to outdoor signs, we help choose materials and finishing that fit where the item will be used.',
    ],
    includes: ['Indoor and outdoor banner options', 'Readable large-format layout', 'Material and finishing advice'],
    idealFor: ['Shopfront branding', 'Events and announcements', 'Directional signs'],
    prepare: ['Exact banner or sign dimensions', 'Message text, logo, photos, and contact details', 'Indoor or outdoor location, hanging method, and material preference'],
    turnaround: 'Banner and signage timing depends on size, material, eyelets, framing, mounting, and installation requirements.',
  },
  'mug-printing': {
    headline: 'Personalized mugs for gifts, teams, and brand reminders.',
    paragraphs: [
      'Custom mugs are useful for birthdays, appreciation gifts, office branding, school events, church groups, and promotions. We place photos, names, logos, or messages clearly so the design feels balanced on the mug.',
      'You can bring a ready design or ask us to create a simple layout from your text, image, or brand details.',
    ],
    includes: ['Photo, name, or logo placement', 'Full-colour mug artwork', 'Gift-ready personalization'],
    idealFor: ['Birthdays and celebrations', 'Corporate gifts', 'Church and school souvenirs'],
    prepare: ['High-resolution photo, logo, name, or message for the mug', 'Print placement, such as one side, both sides, or wraparound', 'Number of mugs and any gift deadline'],
    turnaround: 'Mug printing timing depends on artwork readiness, mug stock, placement style, and the number of mugs ordered.',
  },
  'souvenir-printing': {
    headline: 'Custom souvenirs that keep your event or brand remembered.',
    paragraphs: [
      'Souvenir printing helps turn everyday items into keepsakes and promotional pieces. We customize items with names, logos, event details, photos, or short messages for a polished final look.',
      'This service is ideal when you want guests, clients, staff, or members to leave with something useful and memorable.',
    ],
    includes: ['Logo and message placement', 'Event and brand personalization', 'Item selection guidance'],
    idealFor: ['Corporate events', 'Weddings and parties', 'Church, school, and group programmes'],
    prepare: ['Souvenir item type, such as pens, keyholders, shirts, mugs, or bags', 'Logo, event name, date, photos, or message to print', 'Quantity, item colours, and event deadline'],
    turnaround: 'Souvenir printing depends on item availability, artwork approval, personalization method, and delivery date.',
  },
  'screen-printing': {
    headline: 'Bold, durable prints for shirts and fabric items.',
    paragraphs: [
      'Screen printing is a strong choice for bulk apparel and promotional wear because it gives solid colour coverage and long-lasting results. We prepare artwork for clean edges and consistent placement across each item.',
      'It works especially well for logos, simple graphics, slogans, and event designs that need to stand out.',
    ],
    includes: ['Artwork setup for fabric printing', 'Logo and slogan placement', 'Bulk order support'],
    idealFor: ['T-shirts and aprons', 'Event apparel', 'Team and group wear'],
    prepare: ['Garment type, colour, sizes, and quantity per size', 'Artwork file with the exact print colours needed', 'Print position, design size, and quantity per design'],
    turnaround: 'Screen printing depends on colour separations, garment count, setup time, and drying or curing time.',
  },
  'book-printing': {
    headline: 'Book printing that keeps your pages organized and presentable.',
    paragraphs: [
      'We print books, manuals, church materials, course content, reports, catalogues, and manuscripts with careful attention to page order, cover presentation, and finishing.',
      'Whether you need a short run or a larger quantity, we help review file setup, paper choice, binding options, and cover requirements.',
    ],
    includes: ['Interior page printing', 'Cover print options', 'Binding and finishing guidance'],
    idealFor: ['Authors and publishers', 'Schools and churches', 'Manuals and course materials'],
    prepare: ['Final PDF or manuscript arranged in correct page order', 'Trim size, page count, and number of copies', 'Cover file, paper choice, and binding method'],
    turnaround: 'Book printing depends on page count, cover preparation, copy quantity, and binding method such as staple, spiral, or perfect binding.',
  },
  'exercise-books': {
    headline: 'Custom exercise books for schools, classes, and institutions.',
    paragraphs: [
      'We produce exercise books that can be branded with school names, crests, subject labels, class details, or custom cover artwork. The result is practical for daily learning and consistent for institutional use.',
      'You can request simple covers, ruled pages, subject variations, or bulk quantities for school supply.',
    ],
    includes: ['Custom cover branding', 'Ruled page printing', 'Bulk production support'],
    idealFor: ['Schools and academies', 'Training centres', 'Institutional learning materials'],
    prepare: ['School name, crest, cover artwork, and subject or class labels', 'Ruled page style, page count, and book size', 'Quantity per cover design or class level'],
    turnaround: 'Exercise book production depends on cover approval, ruling setup, page count, and quantity per subject or class.',
  },
  'office-stationery': {
    headline: 'Office stationery that keeps your daily paperwork organized.',
    paragraphs: [
      'We print stationery items that support daily business operations, from receipts and forms to notepads, invoices, branded sheets, and internal documents.',
      'Each item is set up to be practical, readable, and consistent with your business identity.',
    ],
    includes: ['Forms, receipts, and notepads', 'Branding and layout cleanup', 'Bulk print options'],
    idealFor: ['Offices and shops', 'Schools and churches', 'Administrative teams'],
    prepare: ['Sample form, receipt, invoice, notepad, or stationery layout', 'Logo, contact details, fields, numbering, and duplicate-copy needs', 'Paper size, binding or padding preference, and quantity'],
    turnaround: 'Office stationery timing depends on form complexity, numbering or duplicate-copy setup, padding, and order quantity.',
  },
  'cv-application-letter-typing': {
    headline: 'Clear CVs and application letters that present you professionally.',
    paragraphs: [
      'We help type, format, and polish CVs and application letters so your experience, skills, and contact details are easy to read. The layout is kept clean, professional, and suitable for job applications.',
      'If you already have a draft, we can refine it. If you are starting from notes, we can help arrange the information into a presentable document.',
    ],
    includes: ['Typing and formatting', 'Structure and spacing cleanup', 'Print-ready and digital copies'],
    idealFor: ['Job applications', 'Internship applications', 'Professional document updates'],
    prepare: ['Personal details, contact information, work history, and education', 'Skills, certificates, referees, and preferred job target', 'Existing CV draft, passport photo, or application instructions if available'],
    turnaround: 'CV typing is usually quick when all details are ready; rewriting, formatting choices, and application letters add review time.',
  },
  'internet-services': {
    headline: 'Reliable support for online tasks and digital access.',
    paragraphs: [
      'Our internet services help customers complete online tasks such as browsing, research, form access, email support, downloads, uploads, and basic online submissions.',
      'We assist with care and accuracy, especially when documents, forms, or application details need to be handled properly.',
    ],
    includes: ['Online browsing and research support', 'Downloads and uploads', 'Email and form assistance'],
    idealFor: ['Students and applicants', 'Business document tasks', 'General online access'],
    prepare: ['Website link, application portal, email task, or online service needed', 'Required documents for upload, download, or submission', 'Login details, phone access, or OTP support if the task requires it'],
    turnaround: 'Internet service timing depends on the website speed, account access, document readiness, and whether submissions require verification codes.',
  },
  scanning: {
    headline: 'High-resolution scanning for documents, photos, and records.',
    paragraphs: [
      'Scanning converts hardcopy documents and photos into clean digital files for storage, sharing, printing, or online submission. We handle pages carefully and prepare files in practical formats.',
      'This service is useful for certificates, IDs, application documents, receipts, forms, archived paperwork, and image records.',
    ],
    includes: ['Document and photo scanning', 'PDF, JPG, or PNG output options', 'Basic file organization'],
    idealFor: ['Online applications', 'Digital archives', 'Document sharing'],
    prepare: ['Hardcopy documents, photos, IDs, certificates, or forms to scan', 'Preferred file format such as PDF, JPG, or PNG', 'Email address, storage device, file naming, and page order instructions'],
    turnaround: 'Small scanning batches are usually quick; fragile originals, many pages, or file naming requirements add time.',
  },
  'document-editing': {
    headline: 'Polished documents with better structure and presentation.',
    paragraphs: [
      'We edit and format documents so they look cleaner, read better, and meet the purpose they are meant for. This may include spacing, headings, alignment, grammar cleanup, tables, page numbering, and general layout improvement.',
      'The goal is to make your document easier to understand and ready for print, email, submission, or presentation.',
    ],
    includes: ['Typing and text cleanup', 'Page layout and formatting', 'Tables, headings, and numbering'],
    idealFor: ['Reports and proposals', 'Academic documents', 'Business letters and forms'],
    prepare: ['Editable Word, PDF, or hardcopy document to revise', 'Clear correction notes, new text, or formatting instructions', 'Required output format, page size, and deadline'],
    turnaround: 'Document editing depends on page length, number of corrections, formatting complexity, and whether typing from hardcopy is needed.',
  },
  'photo-editing': {
    headline: 'Photo cleanup, enhancement, and retouching for better presentation.',
    paragraphs: [
      'We improve photos for print, documents, gifts, branding, and personal use. Editing can include cropping, colour correction, background cleanup, retouching, restoration, and preparing images for specific sizes.',
      'Whether the photo is for a design, frame, ID, souvenir, or online profile, we adjust it so it looks clearer and more suitable for the final use.',
    ],
    includes: ['Cropping and resizing', 'Colour and brightness correction', 'Background cleanup and retouching'],
    idealFor: ['Portraits and passport-style photos', 'Product and brand images', 'Old photo restoration'],
    prepare: ['Original high-resolution photo or scanned image', 'Required crop, background, colour, or retouching instructions', 'Final use, such as passport photo, print size, frame, or online profile'],
    turnaround: 'Basic cropping and background cleanup can be quick; restoration, retouching, and multiple photo versions take longer.',
  },
  'branding-services': {
    headline: 'Brand identity materials that make your business easier to recognize.',
    paragraphs: [
      'Branding services help shape how your business looks across printed and digital materials. We can support logo use, colours, stationery, signs, uniforms, promotional items, and marketing pieces.',
      'The aim is to create a consistent identity that customers can recognize wherever they meet your brand.',
    ],
    includes: ['Logo and visual identity support', 'Stationery and promotional material design', 'Brand consistency guidance'],
    idealFor: ['New businesses', 'Rebrands and campaigns', 'Shops, schools, churches, and organizations'],
    prepare: ['Business name, tagline, services, audience, and contact details', 'Existing logo, brand colours, or reference designs', 'Brand items needed, such as signs, cards, uniforms, labels, or stationery'],
    turnaround: 'Branding service timing depends on the number of brand items, logo readiness, revisions, and how many formats are needed.',
  },
  'vinyl-stickers': {
    headline: 'Custom stickers for labels, branding, decoration, and promotion.',
    paragraphs: [
      'Vinyl stickers are useful for product labels, shop branding, packaging, windows, vehicles, laptops, bottles, and promotional giveaways. We prepare artwork so it cuts or prints cleanly at the required size.',
      'You can request simple text stickers, logo stickers, full-colour labels, or custom shapes depending on the use.',
    ],
    includes: ['Custom sizing', 'Logo and label setup', 'Indoor and outdoor sticker options'],
    idealFor: ['Product packaging', 'Brand labels', 'Decorative and promotional use'],
    prepare: ['Artwork, logo, label text, or sticker message', 'Sticker size, shape, and whether it needs cutting around the design', 'Quantity and surface type, such as glass, packaging, vehicle, laptop, or wall'],
    turnaround: 'Vinyl sticker timing depends on print size, cutting detail, indoor or outdoor material, and quantity.',
  },
  'vehicle-branding': {
    headline: 'Turn your vehicle into a moving advert.',
    paragraphs: [
      'Vehicle branding helps businesses advertise on the road with logos, contact details, service information, and bold visuals. We design for visibility, readability, and placement on the vehicle body.',
      'The work can range from simple stickers and decals to larger partial branding, depending on your budget and vehicle type.',
    ],
    includes: ['Vehicle artwork layout', 'Logo and contact placement', 'Vinyl sticker production guidance'],
    idealFor: ['Delivery vehicles', 'Company cars', 'Taxis, vans, buses, and trucks'],
    prepare: ['Vehicle type, photos, and measurements of the panels to brand', 'Logo, services, phone numbers, social handles, and brand colours', 'Preferred branding areas, such as doors, bonnet, rear, or full side panels'],
    turnaround: 'Vehicle branding depends on vehicle measurements, artwork approval, vinyl production size, and installation scheduling.',
  },
  'large-format-printing': {
    headline: 'Large prints for displays, events, promotions, and visibility.',
    paragraphs: [
      'Large format printing is used when your message needs to be seen from a distance. We prepare designs and prints for banners, backdrops, posters, displays, and other oversized materials.',
      'We check image quality, text size, and layout proportions so the final print remains sharp and readable at scale.',
    ],
    includes: ['Large artwork setup', 'High-impact print output', 'Material and size guidance'],
    idealFor: ['Event backdrops', 'Outdoor advertising', 'Shop and campaign displays'],
    prepare: ['Exact finished dimensions for the poster, backdrop, banner, or display', 'High-resolution artwork, logos, photos, and text', 'Material choice, indoor or outdoor use, and finishing method'],
    turnaround: 'Large format printing depends on final size, artwork resolution, material, trimming, eyelets, mounting, or other finishing needs.',
  },
  'stamp-making': {
    headline: 'Custom stamps for official, business, and personal use.',
    paragraphs: [
      'We create stamps for businesses, schools, churches, offices, and individuals who need repeated marks for documents. Stamps can include names, logos, addresses, signatures, dates, or official wording.',
      'We help arrange the text clearly so the impression is readable and suitable for daily use.',
    ],
    includes: ['Text and logo stamp setup', 'Rubber or self-inking stamp options', 'Readable layout preparation'],
    idealFor: ['Business offices', 'Schools and institutions', 'Churches and associations'],
    prepare: ['Exact stamp wording, name, address, date line, or approval text', 'Logo, signature, or registration details if needed', 'Preferred stamp size and type, such as rubber or self-inking'],
    turnaround: 'Stamp making depends on wording approval, logo clarity, stamp size, and the selected stamp mechanism.',
  },
  'customized-jerseys': {
    headline: 'Team jerseys customized with names, numbers, and identity.',
    paragraphs: [
      'We customize jerseys for football teams, schools, churches, clubs, and events with names, numbers, logos, and sponsor marks. The layout is planned so each jersey looks consistent across the group.',
      'You can bring your jerseys or discuss sourcing and printing options based on your quantity and deadline.',
    ],
    includes: ['Name and number customization', 'Logo and sponsor placement', 'Team order organization'],
    idealFor: ['Football teams', 'School sports', 'Church and community events'],
    prepare: ['Jersey sizes, colours, and quantity per size', 'Names and numbers list matched to each jersey', 'Team logo, sponsor artwork, and front or back placement instructions'],
    turnaround: 'Jersey customization depends on garment availability, name and number list accuracy, print placement, and total quantity.',
  },
  'customized-polo-shirts': {
    headline: 'Branded polo shirts for a smart group or corporate look.',
    paragraphs: [
      'Customized polo shirts are ideal for businesses, staff uniforms, event teams, school groups, and associations. We place logos, names, or short text neatly for a clean professional appearance.',
      'Depending on the look you want, we can guide you between print and embroidery options.',
    ],
    includes: ['Logo placement', 'Print or embroidery guidance', 'Group size coordination'],
    idealFor: ['Corporate uniforms', 'Event teams', 'Associations and school groups'],
    prepare: ['Polo shirt colour, size breakdown, and quantity', 'Logo, staff names, department text, or short message', 'Preferred chest, sleeve, back, or cap placement and print or embroidery method'],
    turnaround: 'Polo shirt production depends on shirt stock, size mix, logo setup, finishing method, and quantity.',
  },
  'embroidery-services': {
    headline: 'Premium stitched branding for shirts, caps, bags, and uniforms.',
    paragraphs: [
      'Embroidery gives apparel and accessories a raised, professional finish that works well for uniforms and long-term brand use. We review your logo and prepare it for clean stitching.',
      'This service is best for designs that need to last through frequent wear and washing.',
    ],
    includes: ['Logo digitizing guidance', 'Thread colour selection', 'Placement and sizing support'],
    idealFor: ['Polo shirts and uniforms', 'Caps and bags', 'Corporate and school identity'],
    prepare: ['Logo file or text to digitize for stitching', 'Item type, fabric, colour, and quantity', 'Stitch placement, approximate size, and thread colour preference'],
    turnaround: 'Embroidery services depend on digitizing, stitch complexity, thread colour setup, and the number of garments or accessories.',
  },
  'invitation-cards': {
    headline: 'Invitation cards that set the tone for your occasion.',
    paragraphs: [
      'We design and print invitation cards for weddings, birthdays, graduations, engagements, church programmes, corporate events, and special gatherings. The layout balances the event details with a style that fits the occasion.',
      'You can choose a simple elegant look, a colourful celebratory design, or a branded formal invitation.',
    ],
    includes: ['Custom invitation layout', 'Event details formatting', 'Print and finish options'],
    idealFor: ['Weddings and parties', 'Graduations and anniversaries', 'Corporate and church events'],
    prepare: ['Event type, host names, date, time, venue, and RSVP details', 'Theme colours, dress code, photos, or invitation reference style', 'Quantity, card size, envelope choice, and any guest-name personalization'],
    turnaround: 'Invitation card timing depends on design approval, guest-name personalization, print quantity, and finishing such as folds or envelopes.',
  },
  'church-programmes': {
    headline: 'Church programmes designed with order, dignity, and clarity.',
    paragraphs: [
      'We prepare church programmes for services, crusades, anniversaries, harvests, conventions, ordinations, and special events. The design can include schedules, hymns, speaker details, photos, adverts, and acknowledgements.',
      'We focus on clean page flow so members and guests can follow the programme easily.',
    ],
    includes: ['Programme layout and page ordering', 'Photo and advert placement', 'Cover and interior printing'],
    idealFor: ['Sunday and special services', 'Conventions and crusades', 'Anniversaries and church events'],
    prepare: ['Order of service, hymns, readings, speaker list, and announcements', 'Photos, messages, adverts, church logo, and theme details', 'Page count, programme size, quantity, and service date'],
    turnaround: 'Church programme timing depends on content completeness, page count, advert placement, proof approval, and print quantity.',
  },
  'funeral-brochures': {
    headline: 'Thoughtful funeral brochures that honour a life with dignity.',
    paragraphs: [
      'We design and print funeral brochures with care, respect, and attention to detail. Brochures can include the order of service, biography, tributes, family photos, hymns, acknowledgements, and memorial messages.',
      'Our aim is to create a keepsake that is clear, well-arranged, and fitting for the occasion.',
    ],
    includes: ['Biography and tribute layout', 'Photo arrangement', 'Cover and multi-page printing'],
    idealFor: ['Funeral and memorial services', 'Family keepsakes', 'Church service programmes'],
    prepare: ['Biography, order of service, family details, hymns, and acknowledgements', 'Clear photos, tributes, memorial messages, and cover wording', 'Brochure size, page count, quantity, and funeral date'],
    turnaround: 'Funeral brochure timing depends on tribute and photo readiness, page count, proof approval, and the service date.',
  },
  'calendars-diaries': {
    headline: 'Branded calendars and diaries that keep your name visible all year.',
    paragraphs: [
      'Calendars and diaries are practical promotional items for clients, staff, members, and partners. We design them with your brand, photos, contact details, key dates, and a clean layout for daily use.',
      'They work well as end-of-year gifts, office stationery, and long-term brand reminders.',
    ],
    includes: ['Calendar and diary layout', 'Brand and photo placement', 'Bulk print support'],
    idealFor: ['Corporate gifts', 'Schools and churches', 'Customer appreciation packages'],
    prepare: ['Year, months, key dates, contact details, and business or school information', 'Logo, photos, adverts, or monthly theme content', 'Calendar or diary format, page count, binding, and quantity'],
    turnaround: 'Calendars and diaries depend on date setup, photo selection, page count, binding method, and quantity.',
  },
  'passport-visa-assistance': {
    headline: 'Document and photo support for passport and visa applications.',
    paragraphs: [
      'We assist with passport and visa-related documentation tasks such as photo preparation, scanning, printing, form support, and document organization. The aim is to help you prepare clean files and copies for submission.',
      'Requirements can vary by application type, so we help you review the requested document format and output.',
    ],
    includes: ['Photo and document preparation', 'Scanning and printing support', 'Form and file organization'],
    idealFor: ['Passport applications', 'Visa documentation', 'Online submissions'],
    prepare: ['Passport or visa checklist, appointment details, or application instructions', 'Required IDs, certificates, forms, receipts, and supporting documents', 'Passport photo specification or image if photo preparation is needed'],
    turnaround: 'Passport and visa assistance depends on application requirements, document readiness, photo specifications, and online portal access.',
  },
  'computer-designing': {
    headline: 'Creative designs prepared for print and digital use.',
    paragraphs: [
      'Computer designing covers flyers, posters, brochures, cards, banners, labels, social media graphics, and other visual materials. We turn your message into a clean design that is ready for print or sharing.',
      'We help with layout, colour, text hierarchy, image placement, and sizing so the final artwork communicates clearly.',
    ],
    includes: ['Flyer, poster, and brochure design', 'Print-ready artwork setup', 'Layout and typography cleanup'],
    idealFor: ['Promotions and events', 'Business marketing', 'Church and school announcements'],
    prepare: ['Text, headline, offer, dates, prices, and contact details for the design', 'Photos, logo, brand colours, and reference style', 'Final size, platform or print use, and deadline'],
    turnaround: 'Computer design timing depends on content readiness, design size, number of revisions, and whether the file is for print or digital use.',
  },
  'digital-printing': {
    headline: 'Fast full-colour printing for sharp everyday materials.',
    paragraphs: [
      'Digital printing is ideal for quick, high-quality prints in small or medium quantities. It works well for flyers, documents, cards, posters, certificates, forms, and marketing pieces.',
      'We check your file and print with attention to colour, sharpness, and page alignment.',
    ],
    includes: ['Full-colour print output', 'Fast setup for short runs', 'Paper and finish guidance'],
    idealFor: ['Flyers and handouts', 'Certificates and documents', 'Small business marketing'],
    prepare: ['Print-ready PDF, image, or document file', 'Quantity, paper size, and single or double-sided choice', 'Paper type, colour expectations, and finishing such as trimming or binding'],
    turnaround: 'Digital printing is often quick for ready files and standard sizes; trimming, binding, or larger quantities add production time.',
  },
  'colour-printing': {
    headline: 'Bright colour prints for documents, designs, and presentations.',
    paragraphs: [
      'Colour printing helps bring photos, graphics, charts, flyers, posters, and branded materials to life. We prepare output for clear colour reproduction and neat page presentation.',
      'This is useful when the appearance of images, logos, or visual information matters.',
    ],
    includes: ['Full-colour document printing', 'Photo and graphic output', 'Paper size options'],
    idealFor: ['Flyers and posters', 'Reports and presentations', 'Photos and certificates'],
    prepare: ['Digital file with photos, graphics, charts, or brand colours', 'Quantity, finished size, and paper type', 'Colour expectations, bleed or border preference, and any finishing needed'],
    turnaround: 'Standard colour printing is usually quick when files are ready; colour checks, photo-heavy files, or finishing require more time.',
  },
  'black-white-printing': {
    headline: 'Affordable black-and-white printing for clear everyday documents.',
    paragraphs: [
      'Black-and-white printing is a cost-effective choice for forms, notes, reports, applications, handouts, manuals, and everyday office documents. We keep text sharp and pages properly aligned.',
      'It is a practical option when readability and quantity matter more than colour.',
    ],
    includes: ['Sharp text output', 'Single or double-sided printing', 'Bulk document support'],
    idealFor: ['School handouts', 'Office paperwork', 'Reports and application documents'],
    prepare: ['Digital document, PDF, notes, report, form, or application file', 'Number of pages, copies, and page order requirements', 'Single or double-sided choice, stapling, collation, or binding needs'],
    turnaround: 'Black-and-white printing is quick for ready documents; bulk copies, double-sided sets, stapling, or collation need extra time.',
  },
}

const ALIASES: Record<string, string> = {
  'banners-signage': 'banners-signages',
  'flyers-brochures': 'computer-designing',
  'custom-jerseys': 'customized-jerseys',
  'polo-shirts-caps': 'customized-polo-shirts',
  embroidery: 'embroidery-services',
  'branding-design': 'branding-services',
  'wedding-stationery': 'invitation-cards',
  'annual-reports': 'book-printing',
  posters: 'large-format-printing',
}

export function getServiceContent(service: ServiceLike): ServiceContent {
  const slug = ALIASES[service.slug] ?? service.slug
  const specific = SERVICE_CONTENT[slug]
  if (specific) return specific

  const categoryContent = DEFAULT_CONTENT[service.category] ?? DEFAULT_CONTENT.Print

  return {
    ...categoryContent,
    paragraphs: [
      service.description || categoryContent.paragraphs[0],
      categoryContent.paragraphs[1],
    ],
  }
}
