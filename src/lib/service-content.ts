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
    prepare: ['Final artwork or editable document', 'Quantity needed', 'Preferred paper size and finish'],
    turnaround: 'Same day for many standard jobs, depending on quantity.',
  },
  Signage: {
    headline: 'Visible branding for shops, events, vehicles, and outdoor spaces.',
    paragraphs: [
      'We produce signage that is easy to read, strong enough for its setting, and matched to your brand colours and message.',
      'From small directional signs to large promotional displays, we help you choose sizes, materials, and finishing that suit the location.',
    ],
    includes: ['Artwork sizing for large formats', 'Indoor and outdoor material guidance', 'Durable finishing for display use'],
    idealFor: ['Retail shops and offices', 'Events and exhibitions', 'Outdoor advertising'],
    prepare: ['Logo or design files', 'Required dimensions', 'Installation location or display purpose'],
    turnaround: 'Usually a few days, depending on size, finishing, and installation needs.',
  },
  Apparel: {
    headline: 'Custom apparel that carries your identity clearly.',
    paragraphs: [
      'We help teams, schools, churches, businesses, and groups create wearable branded items with clean placement and strong visual impact.',
      'Whether you need names, numbers, logos, or full artwork, we guide the print method and material choice for the best result.',
    ],
    includes: ['Artwork placement guidance', 'Name, number, and logo printing options', 'Bulk order support'],
    idealFor: ['Teams and schools', 'Corporate uniforms', 'Events and group wear'],
    prepare: ['Sizes and quantities', 'Logo or artwork files', 'Names or numbers if required'],
    turnaround: 'Timing depends on garment quantity, sizes, and customization details.',
  },
  Design: {
    headline: 'Design support that makes your documents and brand look polished.',
    paragraphs: [
      'This service helps turn rough information, ideas, or files into clean, readable, and professional work ready for use or print.',
      'We focus on layout, hierarchy, consistency, and presentation so the final result communicates clearly.',
    ],
    includes: ['Layout and formatting support', 'Typography and spacing cleanup', 'Print-ready or digital file preparation'],
    idealFor: ['Business documents', 'Brand and marketing materials', 'Personal applications and presentations'],
    prepare: ['Text or content to include', 'Any logo or reference style', 'Deadline and output format'],
    turnaround: 'Simple edits can be quick; full design work depends on complexity.',
  },
  Publishing: {
    headline: 'Organized print and finishing for books, programmes, and publications.',
    paragraphs: [
      'We prepare multi-page work with attention to page order, readability, binding, and the finishing details that make publications feel complete.',
      'From church programmes to books and institutional materials, we help make your content presentable and easy to handle.',
    ],
    includes: ['Page setup and ordering', 'Cover and interior print support', 'Binding or finishing guidance'],
    idealFor: ['Books and reports', 'Church and event programmes', 'School and institutional materials'],
    prepare: ['Final document or manuscript', 'Page count and quantity', 'Preferred binding or finish'],
    turnaround: 'Depends on page count, quantity, and binding requirements.',
  },
  Embroidery: {
    headline: 'Textured, long-lasting branding for garments and accessories.',
    paragraphs: [
      'Embroidery gives logos and names a premium finish that lasts well on uniforms, caps, shirts, bags, and other fabric items.',
      'We review your artwork and advise on thread colours, placement, and size so the stitched result stays clean and readable.',
    ],
    includes: ['Logo setup for stitching', 'Thread colour guidance', 'Placement and sizing advice'],
    idealFor: ['Uniforms and polos', 'Caps and bags', 'Corporate and school branding'],
    prepare: ['Logo or text to embroider', 'Item type and quantity', 'Preferred placement'],
    turnaround: 'Depends on stitch complexity and quantity.',
  },
  Gifts: {
    headline: 'Personalized items for memorable gifts and brand promotion.',
    paragraphs: [
      'We create customized gift and souvenir items that carry names, photos, messages, or branding in a neat and presentable way.',
      'These items are useful for events, appreciation packages, promotions, and personal celebrations.',
    ],
    includes: ['Artwork placement support', 'Personalization with names or messages', 'Gift and promotional item guidance'],
    idealFor: ['Corporate gifts', 'Events and celebrations', 'Promotional campaigns'],
    prepare: ['Names, photos, or artwork', 'Quantity needed', 'Preferred item type'],
    turnaround: 'Depends on item availability, artwork, and quantity.',
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
    prepare: ['Original hardcopy or digital file', 'Number of copies', 'Paper size and colour preference'],
    turnaround: 'Most small and medium copy jobs can be handled quickly while you wait.',
  },
  lamination: {
    headline: 'Protect important prints with a clean, durable finish.',
    paragraphs: [
      'Lamination helps preserve certificates, ID sheets, cards, notices, menus, photos, and frequently handled documents. It adds a protective layer that resists dirt, moisture, and daily wear while giving the piece a neat finish.',
      'We check the document size and recommend a suitable lamination finish so the final item is sealed properly and ready for long-term use.',
    ],
    includes: ['Document protection', 'Glossy sealed finish', 'Size trimming after lamination'],
    idealFor: ['Certificates and cards', 'Menus and notices', 'Photos and keepsakes'],
    prepare: ['Clean final print or original', 'Preferred size', 'Quantity needed'],
    turnaround: 'Usually ready quickly for standard sizes.',
  },
  'spiral-binding': {
    headline: 'Neatly bound documents that are easy to read and present.',
    paragraphs: [
      'Spiral binding is a practical finish for reports, manuals, proposals, coursework, notebooks, and training documents. It keeps pages together securely while allowing the document to open flat for easy reading.',
      'We help arrange the page order, add front and back covers where needed, and finish the document so it feels organized and professional.',
    ],
    includes: ['Page ordering checks', 'Front and back cover options', 'Durable spiral binding'],
    idealFor: ['Reports and manuals', 'School projects', 'Training and workshop documents'],
    prepare: ['Printed pages or print-ready PDF', 'Page count', 'Cover preference'],
    turnaround: 'Often same day after printing, depending on quantity.',
  },
  'id-card-printing': {
    headline: 'Professional ID cards for teams, schools, and organizations.',
    paragraphs: [
      'We design and print ID cards that look official, readable, and durable. Each card can include names, roles, photos, logos, identification numbers, and other details your organization needs.',
      'The layout is prepared for clarity, with careful spacing for photos and text so the cards are easy to verify at a glance.',
    ],
    includes: ['Card layout and photo placement', 'Logo and role details', 'Lamination or protective finishing options'],
    idealFor: ['Schools and churches', 'Businesses and staff teams', 'Events and membership groups'],
    prepare: ['Names and roles', 'Clear passport-style photos', 'Logo and card details'],
    turnaround: 'Same-day options may be available for prepared details and smaller quantities.',
  },
  'business-cards': {
    headline: 'Business cards that make your first impression feel intentional.',
    paragraphs: [
      'A well-designed business card gives people a simple, memorable way to keep your contact details. We create cards that balance your name, role, brand, phone number, location, and social handles without looking crowded.',
      'You can print from an existing design or ask us to prepare a fresh layout that matches your brand style.',
    ],
    includes: ['Single or double-sided layouts', 'Matte or gloss finish guidance', 'Print-ready design support'],
    idealFor: ['Entrepreneurs and startups', 'Corporate teams', 'Service providers and creatives'],
    prepare: ['Logo and brand colours', 'Contact details', 'Quantity and finish preference'],
    turnaround: 'Standard card orders are usually quick once the design is approved.',
  },
  letterheads: {
    headline: 'Branded letterheads for professional communication.',
    paragraphs: [
      'Letterheads make invoices, letters, proposals, official notices, and internal documents feel consistent and trustworthy. We design and print layouts that keep your brand visible while leaving enough space for clear writing.',
      'Your letterhead can include your logo, contact details, address, registration information, and subtle brand elements.',
    ],
    includes: ['Clean branded layout', 'Print-ready document setup', 'Bulk office printing options'],
    idealFor: ['Business letters', 'Invoices and quotations', 'Official documents'],
    prepare: ['Logo and contact details', 'Preferred paper size', 'Quantity needed'],
    turnaround: 'Design and print timing depends on approval and quantity.',
  },
  'roll-up-banners': {
    headline: 'Portable banners for strong event and shop visibility.',
    paragraphs: [
      'Roll-up banners are easy to transport, quick to set up, and excellent for promoting products, services, campaigns, and events. We prepare artwork at the correct size so text stays readable from a distance.',
      'The design can include your logo, headline, photos, service list, contact details, and a clear call to action.',
    ],
    includes: ['Large-format artwork setup', 'Print and stand preparation', 'Readable layout guidance'],
    idealFor: ['Exhibitions and fairs', 'Church and school events', 'Shop and office displays'],
    prepare: ['Logo and text', 'Photos if needed', 'Preferred banner message'],
    turnaround: 'Usually a few days after artwork approval.',
  },
  'banners-signages': {
    headline: 'Banners and signs that make your message easy to notice.',
    paragraphs: [
      'We create banners and signage for promotions, directions, events, shopfronts, announcements, and brand visibility. The design is planned around viewing distance, placement, and the message you need people to remember.',
      'From indoor banners to outdoor signs, we help choose materials and finishing that fit where the item will be used.',
    ],
    includes: ['Indoor and outdoor banner options', 'Readable large-format layout', 'Material and finishing advice'],
    idealFor: ['Shopfront branding', 'Events and announcements', 'Directional signs'],
    prepare: ['Required size', 'Text and logo', 'Indoor or outdoor use'],
    turnaround: 'Depends on size, quantity, and finishing.',
  },
  'mug-printing': {
    headline: 'Personalized mugs for gifts, teams, and brand reminders.',
    paragraphs: [
      'Custom mugs are useful for birthdays, appreciation gifts, office branding, school events, church groups, and promotions. We place photos, names, logos, or messages clearly so the design feels balanced on the mug.',
      'You can bring a ready design or ask us to create a simple layout from your text, image, or brand details.',
    ],
    includes: ['Photo, name, or logo placement', 'Full-colour mug artwork', 'Gift-ready personalization'],
    idealFor: ['Birthdays and celebrations', 'Corporate gifts', 'Church and school souvenirs'],
    prepare: ['Image or logo', 'Names or message', 'Quantity needed'],
    turnaround: 'Timing depends on quantity and artwork readiness.',
  },
  'souvenir-printing': {
    headline: 'Custom souvenirs that keep your event or brand remembered.',
    paragraphs: [
      'Souvenir printing helps turn everyday items into keepsakes and promotional pieces. We customize items with names, logos, event details, photos, or short messages for a polished final look.',
      'This service is ideal when you want guests, clients, staff, or members to leave with something useful and memorable.',
    ],
    includes: ['Logo and message placement', 'Event and brand personalization', 'Item selection guidance'],
    idealFor: ['Corporate events', 'Weddings and parties', 'Church, school, and group programmes'],
    prepare: ['Item type', 'Artwork or message', 'Quantity and deadline'],
    turnaround: 'Depends on item type, stock, and quantity.',
  },
  'screen-printing': {
    headline: 'Bold, durable prints for shirts and fabric items.',
    paragraphs: [
      'Screen printing is a strong choice for bulk apparel and promotional wear because it gives solid colour coverage and long-lasting results. We prepare artwork for clean edges and consistent placement across each item.',
      'It works especially well for logos, simple graphics, slogans, and event designs that need to stand out.',
    ],
    includes: ['Artwork setup for fabric printing', 'Logo and slogan placement', 'Bulk order support'],
    idealFor: ['T-shirts and aprons', 'Event apparel', 'Team and group wear'],
    prepare: ['Garment type and sizes', 'Artwork or logo', 'Quantity per design'],
    turnaround: 'Depends on artwork colours, garment quantity, and drying/finishing time.',
  },
  'book-printing': {
    headline: 'Book printing that keeps your pages organized and presentable.',
    paragraphs: [
      'We print books, manuals, church materials, course content, reports, catalogues, and manuscripts with careful attention to page order, cover presentation, and finishing.',
      'Whether you need a short run or a larger quantity, we help review file setup, paper choice, binding options, and cover requirements.',
    ],
    includes: ['Interior page printing', 'Cover print options', 'Binding and finishing guidance'],
    idealFor: ['Authors and publishers', 'Schools and churches', 'Manuals and course materials'],
    prepare: ['Final PDF or manuscript', 'Page count and size', 'Cover file or design request'],
    turnaround: 'Depends on page count, copies, and binding method.',
  },
  'exercise-books': {
    headline: 'Custom exercise books for schools, classes, and institutions.',
    paragraphs: [
      'We produce exercise books that can be branded with school names, crests, subject labels, class details, or custom cover artwork. The result is practical for daily learning and consistent for institutional use.',
      'You can request simple covers, ruled pages, subject variations, or bulk quantities for school supply.',
    ],
    includes: ['Custom cover branding', 'Ruled page printing', 'Bulk production support'],
    idealFor: ['Schools and academies', 'Training centres', 'Institutional learning materials'],
    prepare: ['School logo and cover details', 'Page count', 'Quantity per design'],
    turnaround: 'Depends on quantity, page count, and cover design approval.',
  },
  'office-stationery': {
    headline: 'Office stationery that keeps your daily paperwork organized.',
    paragraphs: [
      'We print stationery items that support daily business operations, from receipts and forms to notepads, invoices, branded sheets, and internal documents.',
      'Each item is set up to be practical, readable, and consistent with your business identity.',
    ],
    includes: ['Forms, receipts, and notepads', 'Branding and layout cleanup', 'Bulk print options'],
    idealFor: ['Offices and shops', 'Schools and churches', 'Administrative teams'],
    prepare: ['Sample or required fields', 'Logo and contact details', 'Quantity needed'],
    turnaround: 'Depends on item type, design needs, and quantity.',
  },
  'cv-application-letter-typing': {
    headline: 'Clear CVs and application letters that present you professionally.',
    paragraphs: [
      'We help type, format, and polish CVs and application letters so your experience, skills, and contact details are easy to read. The layout is kept clean, professional, and suitable for job applications.',
      'If you already have a draft, we can refine it. If you are starting from notes, we can help arrange the information into a presentable document.',
    ],
    includes: ['Typing and formatting', 'Structure and spacing cleanup', 'Print-ready and digital copies'],
    idealFor: ['Job applications', 'Internship applications', 'Professional document updates'],
    prepare: ['Personal details and work history', 'Education and skills', 'Job title or application purpose'],
    turnaround: 'Simple typing and formatting can often be completed quickly.',
  },
  'internet-services': {
    headline: 'Reliable support for online tasks and digital access.',
    paragraphs: [
      'Our internet services help customers complete online tasks such as browsing, research, form access, email support, downloads, uploads, and basic online submissions.',
      'We assist with care and accuracy, especially when documents, forms, or application details need to be handled properly.',
    ],
    includes: ['Online browsing and research support', 'Downloads and uploads', 'Email and form assistance'],
    idealFor: ['Students and applicants', 'Business document tasks', 'General online access'],
    prepare: ['Website or task details', 'Required documents', 'Login information if needed'],
    turnaround: 'Depends on the website, task requirements, and internet availability.',
  },
  scanning: {
    headline: 'High-resolution scanning for documents, photos, and records.',
    paragraphs: [
      'Scanning converts hardcopy documents and photos into clean digital files for storage, sharing, printing, or online submission. We handle pages carefully and prepare files in practical formats.',
      'This service is useful for certificates, IDs, application documents, receipts, forms, archived paperwork, and image records.',
    ],
    includes: ['Document and photo scanning', 'PDF, JPG, or PNG output options', 'Basic file organization'],
    idealFor: ['Online applications', 'Digital archives', 'Document sharing'],
    prepare: ['Original documents', 'Preferred file format', 'Email or storage method'],
    turnaround: 'Small batches are usually completed quickly.',
  },
  'document-editing': {
    headline: 'Polished documents with better structure and presentation.',
    paragraphs: [
      'We edit and format documents so they look cleaner, read better, and meet the purpose they are meant for. This may include spacing, headings, alignment, grammar cleanup, tables, page numbering, and general layout improvement.',
      'The goal is to make your document easier to understand and ready for print, email, submission, or presentation.',
    ],
    includes: ['Typing and text cleanup', 'Page layout and formatting', 'Tables, headings, and numbering'],
    idealFor: ['Reports and proposals', 'Academic documents', 'Business letters and forms'],
    prepare: ['Editable file or hardcopy', 'Instructions for changes', 'Deadline and output format'],
    turnaround: 'Depends on document length and editing complexity.',
  },
  'photo-editing': {
    headline: 'Photo cleanup, enhancement, and retouching for better presentation.',
    paragraphs: [
      'We improve photos for print, documents, gifts, branding, and personal use. Editing can include cropping, colour correction, background cleanup, retouching, restoration, and preparing images for specific sizes.',
      'Whether the photo is for a design, frame, ID, souvenir, or online profile, we adjust it so it looks clearer and more suitable for the final use.',
    ],
    includes: ['Cropping and resizing', 'Colour and brightness correction', 'Background cleanup and retouching'],
    idealFor: ['Portraits and passport-style photos', 'Product and brand images', 'Old photo restoration'],
    prepare: ['Original photo file', 'Purpose or print size', 'Specific edits needed'],
    turnaround: 'Simple edits are quick; detailed restoration takes longer.',
  },
  'branding-services': {
    headline: 'Brand identity materials that make your business easier to recognize.',
    paragraphs: [
      'Branding services help shape how your business looks across printed and digital materials. We can support logo use, colours, stationery, signs, uniforms, promotional items, and marketing pieces.',
      'The aim is to create a consistent identity that customers can recognize wherever they meet your brand.',
    ],
    includes: ['Logo and visual identity support', 'Stationery and promotional material design', 'Brand consistency guidance'],
    idealFor: ['New businesses', 'Rebrands and campaigns', 'Shops, schools, churches, and organizations'],
    prepare: ['Business name and contact details', 'Logo or design references', 'Services and target audience'],
    turnaround: 'Depends on the number of brand items and revision needs.',
  },
  'vinyl-stickers': {
    headline: 'Custom stickers for labels, branding, decoration, and promotion.',
    paragraphs: [
      'Vinyl stickers are useful for product labels, shop branding, packaging, windows, vehicles, laptops, bottles, and promotional giveaways. We prepare artwork so it cuts or prints cleanly at the required size.',
      'You can request simple text stickers, logo stickers, full-colour labels, or custom shapes depending on the use.',
    ],
    includes: ['Custom sizing', 'Logo and label setup', 'Indoor and outdoor sticker options'],
    idealFor: ['Product packaging', 'Brand labels', 'Decorative and promotional use'],
    prepare: ['Artwork or logo', 'Sticker dimensions', 'Quantity and surface type'],
    turnaround: 'Depends on size, quantity, and cutting/finishing needs.',
  },
  'vehicle-branding': {
    headline: 'Turn your vehicle into a moving advert.',
    paragraphs: [
      'Vehicle branding helps businesses advertise on the road with logos, contact details, service information, and bold visuals. We design for visibility, readability, and placement on the vehicle body.',
      'The work can range from simple stickers and decals to larger partial branding, depending on your budget and vehicle type.',
    ],
    includes: ['Vehicle artwork layout', 'Logo and contact placement', 'Vinyl sticker production guidance'],
    idealFor: ['Delivery vehicles', 'Company cars', 'Taxis, vans, buses, and trucks'],
    prepare: ['Vehicle photos or measurements', 'Logo and contact details', 'Preferred branding areas'],
    turnaround: 'Depends on design approval, size, and installation requirements.',
  },
  'large-format-printing': {
    headline: 'Large prints for displays, events, promotions, and visibility.',
    paragraphs: [
      'Large format printing is used when your message needs to be seen from a distance. We prepare designs and prints for banners, backdrops, posters, displays, and other oversized materials.',
      'We check image quality, text size, and layout proportions so the final print remains sharp and readable at scale.',
    ],
    includes: ['Large artwork setup', 'High-impact print output', 'Material and size guidance'],
    idealFor: ['Event backdrops', 'Outdoor advertising', 'Shop and campaign displays'],
    prepare: ['Required dimensions', 'High-resolution artwork', 'Indoor or outdoor use'],
    turnaround: 'Depends on print size, material, and finishing.',
  },
  'stamp-making': {
    headline: 'Custom stamps for official, business, and personal use.',
    paragraphs: [
      'We create stamps for businesses, schools, churches, offices, and individuals who need repeated marks for documents. Stamps can include names, logos, addresses, signatures, dates, or official wording.',
      'We help arrange the text clearly so the impression is readable and suitable for daily use.',
    ],
    includes: ['Text and logo stamp setup', 'Rubber or self-inking stamp options', 'Readable layout preparation'],
    idealFor: ['Business offices', 'Schools and institutions', 'Churches and associations'],
    prepare: ['Exact stamp wording', 'Logo if needed', 'Preferred stamp size'],
    turnaround: 'Depends on stamp type and artwork readiness.',
  },
  'customized-jerseys': {
    headline: 'Team jerseys customized with names, numbers, and identity.',
    paragraphs: [
      'We customize jerseys for football teams, schools, churches, clubs, and events with names, numbers, logos, and sponsor marks. The layout is planned so each jersey looks consistent across the group.',
      'You can bring your jerseys or discuss sourcing and printing options based on your quantity and deadline.',
    ],
    includes: ['Name and number customization', 'Logo and sponsor placement', 'Team order organization'],
    idealFor: ['Football teams', 'School sports', 'Church and community events'],
    prepare: ['Sizes and quantities', 'Names and numbers list', 'Logos or sponsor artwork'],
    turnaround: 'Depends on quantity, garment availability, and customization details.',
  },
  'customized-polo-shirts': {
    headline: 'Branded polo shirts for a smart group or corporate look.',
    paragraphs: [
      'Customized polo shirts are ideal for businesses, staff uniforms, event teams, school groups, and associations. We place logos, names, or short text neatly for a clean professional appearance.',
      'Depending on the look you want, we can guide you between print and embroidery options.',
    ],
    includes: ['Logo placement', 'Print or embroidery guidance', 'Group size coordination'],
    idealFor: ['Corporate uniforms', 'Event teams', 'Associations and school groups'],
    prepare: ['Shirt sizes and quantities', 'Logo or text', 'Preferred placement'],
    turnaround: 'Depends on shirt quantity and finishing method.',
  },
  'embroidery-services': {
    headline: 'Premium stitched branding for shirts, caps, bags, and uniforms.',
    paragraphs: [
      'Embroidery gives apparel and accessories a raised, professional finish that works well for uniforms and long-term brand use. We review your logo and prepare it for clean stitching.',
      'This service is best for designs that need to last through frequent wear and washing.',
    ],
    includes: ['Logo digitizing guidance', 'Thread colour selection', 'Placement and sizing support'],
    idealFor: ['Polo shirts and uniforms', 'Caps and bags', 'Corporate and school identity'],
    prepare: ['Logo file', 'Item type and quantity', 'Preferred placement'],
    turnaround: 'Depends on stitch complexity and quantity.',
  },
  'invitation-cards': {
    headline: 'Invitation cards that set the tone for your occasion.',
    paragraphs: [
      'We design and print invitation cards for weddings, birthdays, graduations, engagements, church programmes, corporate events, and special gatherings. The layout balances the event details with a style that fits the occasion.',
      'You can choose a simple elegant look, a colourful celebratory design, or a branded formal invitation.',
    ],
    includes: ['Custom invitation layout', 'Event details formatting', 'Print and finish options'],
    idealFor: ['Weddings and parties', 'Graduations and anniversaries', 'Corporate and church events'],
    prepare: ['Event details', 'Names and date', 'Theme colours or references'],
    turnaround: 'Depends on design approval, quantity, and finishing.',
  },
  'church-programmes': {
    headline: 'Church programmes designed with order, dignity, and clarity.',
    paragraphs: [
      'We prepare church programmes for services, crusades, anniversaries, harvests, conventions, ordinations, and special events. The design can include schedules, hymns, speaker details, photos, adverts, and acknowledgements.',
      'We focus on clean page flow so members and guests can follow the programme easily.',
    ],
    includes: ['Programme layout and page ordering', 'Photo and advert placement', 'Cover and interior printing'],
    idealFor: ['Sunday and special services', 'Conventions and crusades', 'Anniversaries and church events'],
    prepare: ['Programme order', 'Photos and messages', 'Page count and quantity'],
    turnaround: 'Depends on page count, content readiness, and quantity.',
  },
  'funeral-brochures': {
    headline: 'Thoughtful funeral brochures that honour a life with dignity.',
    paragraphs: [
      'We design and print funeral brochures with care, respect, and attention to detail. Brochures can include the order of service, biography, tributes, family photos, hymns, acknowledgements, and memorial messages.',
      'Our aim is to create a keepsake that is clear, well-arranged, and fitting for the occasion.',
    ],
    includes: ['Biography and tribute layout', 'Photo arrangement', 'Cover and multi-page printing'],
    idealFor: ['Funeral and memorial services', 'Family keepsakes', 'Church service programmes'],
    prepare: ['Biography and order of service', 'Photos and tributes', 'Quantity and page count'],
    turnaround: 'Depends on content readiness, page count, and print quantity.',
  },
  'calendars-diaries': {
    headline: 'Branded calendars and diaries that keep your name visible all year.',
    paragraphs: [
      'Calendars and diaries are practical promotional items for clients, staff, members, and partners. We design them with your brand, photos, contact details, key dates, and a clean layout for daily use.',
      'They work well as end-of-year gifts, office stationery, and long-term brand reminders.',
    ],
    includes: ['Calendar and diary layout', 'Brand and photo placement', 'Bulk print support'],
    idealFor: ['Corporate gifts', 'Schools and churches', 'Customer appreciation packages'],
    prepare: ['Logo and photos', 'Year and date details', 'Quantity and format'],
    turnaround: 'Depends on format, page count, and quantity.',
  },
  'passport-visa-assistance': {
    headline: 'Document and photo support for passport and visa applications.',
    paragraphs: [
      'We assist with passport and visa-related documentation tasks such as photo preparation, scanning, printing, form support, and document organization. The aim is to help you prepare clean files and copies for submission.',
      'Requirements can vary by application type, so we help you review the requested document format and output.',
    ],
    includes: ['Photo and document preparation', 'Scanning and printing support', 'Form and file organization'],
    idealFor: ['Passport applications', 'Visa documentation', 'Online submissions'],
    prepare: ['Application instructions', 'Required documents', 'Passport photo or image if available'],
    turnaround: 'Depends on the application requirements and document readiness.',
  },
  'computer-designing': {
    headline: 'Creative designs prepared for print and digital use.',
    paragraphs: [
      'Computer designing covers flyers, posters, brochures, cards, banners, labels, social media graphics, and other visual materials. We turn your message into a clean design that is ready for print or sharing.',
      'We help with layout, colour, text hierarchy, image placement, and sizing so the final artwork communicates clearly.',
    ],
    includes: ['Flyer, poster, and brochure design', 'Print-ready artwork setup', 'Layout and typography cleanup'],
    idealFor: ['Promotions and events', 'Business marketing', 'Church and school announcements'],
    prepare: ['Text and images', 'Logo and colour preference', 'Size and deadline'],
    turnaround: 'Depends on design complexity and revisions.',
  },
  'digital-printing': {
    headline: 'Fast full-colour printing for sharp everyday materials.',
    paragraphs: [
      'Digital printing is ideal for quick, high-quality prints in small or medium quantities. It works well for flyers, documents, cards, posters, certificates, forms, and marketing pieces.',
      'We check your file and print with attention to colour, sharpness, and page alignment.',
    ],
    includes: ['Full-colour print output', 'Fast setup for short runs', 'Paper and finish guidance'],
    idealFor: ['Flyers and handouts', 'Certificates and documents', 'Small business marketing'],
    prepare: ['Print-ready file', 'Quantity and paper size', 'Preferred paper type'],
    turnaround: 'Often quick for ready files and standard quantities.',
  },
  'colour-printing': {
    headline: 'Bright colour prints for documents, designs, and presentations.',
    paragraphs: [
      'Colour printing helps bring photos, graphics, charts, flyers, posters, and branded materials to life. We prepare output for clear colour reproduction and neat page presentation.',
      'This is useful when the appearance of images, logos, or visual information matters.',
    ],
    includes: ['Full-colour document printing', 'Photo and graphic output', 'Paper size options'],
    idealFor: ['Flyers and posters', 'Reports and presentations', 'Photos and certificates'],
    prepare: ['Digital file', 'Quantity and size', 'Paper or finish preference'],
    turnaround: 'Many standard colour jobs can be handled quickly.',
  },
  'black-white-printing': {
    headline: 'Affordable black-and-white printing for clear everyday documents.',
    paragraphs: [
      'Black-and-white printing is a cost-effective choice for forms, notes, reports, applications, handouts, manuals, and everyday office documents. We keep text sharp and pages properly aligned.',
      'It is a practical option when readability and quantity matter more than colour.',
    ],
    includes: ['Sharp text output', 'Single or double-sided printing', 'Bulk document support'],
    idealFor: ['School handouts', 'Office paperwork', 'Reports and application documents'],
    prepare: ['Digital file or document', 'Number of pages and copies', 'Single or double-sided preference'],
    turnaround: 'Quick for ready files and standard quantities.',
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
