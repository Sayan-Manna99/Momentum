import Link from 'next/link';
import React from 'react'



function FooterLink({ text, linkText, href }: FooterLinkProps) {
  return (
    <div className="text-center p-4 ">
      <p className="text-sm text-gray-400">
        {text}
        {` `}
        <Link href={href} className='text-blue-400'>{linkText}</Link>
      </p>
    </div>
  );
}

export default FooterLink